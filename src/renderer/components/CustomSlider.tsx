import React, { useState, useRef, useCallback } from 'react'

interface CustomSliderProps {
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min,
  max,
  step,
  onChange
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const getPercentage = useCallback((val: number): number => {
    return ((val - min) / (max - min)) * 100
  }, [min, max])

  const getValue = useCallback((percentage: number): number => {
    const rawValue = (percentage / 100) * (max - min) + min
    return Math.round(rawValue / step) * step
  }, [min, max, step])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    
    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const newValue = getValue(percentage)
    onChange(Math.max(min, Math.min(max, newValue)))
  }, [getValue, onChange, min, max])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const newValue = getValue(percentage)
    onChange(Math.max(min, Math.min(max, newValue)))
  }, [isDragging, getValue, onChange, min, max])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const percentage = getPercentage(value)
  const isNegative = value < 0
  const zeroPercentage = getPercentage(0)
  
  // Handle double-click to reset to zero
  const handleDoubleClick = useCallback(() => {
    onChange(0)
  }, [onChange])

  return (
    <div className="slider-container">
      <div
        ref={sliderRef}
        className="slider-track"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title="Double-click to reset to 0"
      >
        {/* Fill bar */}
        <div
          className="slider-fill"
          style={{
            left: isNegative ? `${percentage}%` : `${zeroPercentage}%`,
            width: isNegative ? `${zeroPercentage - percentage}%` : `${percentage - zeroPercentage}%`,
            background: isNegative 
              ? 'linear-gradient(90deg, #ff6b6b, #ff5252)' 
              : 'linear-gradient(90deg, #007acc, #0086d4)'
          }}
        />
        
        {/* Center marker */}
        <div
          className="slider-center"
          style={{
            left: `${zeroPercentage}%`,
            position: 'absolute',
            width: '2px',
            height: '100%',
            background: '#666666',
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Thumb */}
        <div
          className="slider-thumb"
          style={{
            left: `${percentage}%`,
            cursor: isDragging ? 'grabbing' : 'grab',
            transform: 'translateX(-50%)',
            backgroundColor: value === 0 ? '#666666' : '#ffffff'
          }}
        />
      </div>
    </div>
  )
}

export default CustomSlider
