import React from 'react'
import { Sun, Contrast, Highlighter, Moon, Minus, Palette, Thermometer, Droplets, Focus, RotateCcw } from 'lucide-react'
import { ImageAdjustments, SliderConfig } from '../types'
import CustomSlider from './CustomSlider'

interface AdjustmentPanelProps {
  adjustments: ImageAdjustments
  onAdjustmentChange: (key: keyof ImageAdjustments, value: number) => void
  onReset: () => void
}

const lightAdjustments: SliderConfig[] = [
  { key: 'brightness', label: 'Brightness', icon: 'Sun', min: -100, max: 100, step: 1 },
  { key: 'exposure', label: 'Exposure', icon: 'Sun', min: -100, max: 100, step: 1 },
  { key: 'contrast', label: 'Contrast', icon: 'Contrast', min: -100, max: 100, step: 1 },
  { key: 'highlights', label: 'Highlights', icon: 'Highlighter', min: -100, max: 100, step: 1 },
  { key: 'shadows', label: 'Shadows', icon: 'Moon', min: -100, max: 100, step: 1 },
  { key: 'vignette', label: 'Vignette', icon: 'Minus', min: -100, max: 100, step: 1 },
]

const colorAdjustments: SliderConfig[] = [
  { key: 'saturation', label: 'Saturation', icon: 'Palette', min: -100, max: 100, step: 1 },
  { key: 'warmth', label: 'Warmth', icon: 'Thermometer', min: -100, max: 100, step: 1 },
  { key: 'tint', label: 'Tint', icon: 'Droplets', min: -100, max: 100, step: 1 },
  { key: 'sharpness', label: 'Sharpness', icon: 'Focus', min: -100, max: 100, step: 1 },
]

const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Sun,
    Contrast,
    Highlighter,
    Moon,
    Minus,
    Palette,
    Thermometer,
    Droplets,
    Focus,
  }
  return icons[iconName] || Sun
}

const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({
  adjustments,
  onAdjustmentChange,
  onReset
}) => {
  return (
    <div className="adjustment-panel">
      <div className="adjustment-section">
        <h3>
          <Sun size={18} />
          Light
        </h3>
        {lightAdjustments.map((config) => {
          const IconComponent = getIcon(config.icon)
          return (
            <div key={config.key} className="adjustment-item">
              <div className="adjustment-label">
                <span>
                  <IconComponent size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  {config.label}
                </span>
                <span className="adjustment-value">
                  {adjustments[config.key] > 0 ? '+' : ''}{adjustments[config.key]}
                </span>
              </div>
              <CustomSlider
                value={adjustments[config.key]}
                min={config.min}
                max={config.max}
                step={config.step}
                onChange={(value) => onAdjustmentChange(config.key, value)}
              />
            </div>
          )
        })}
      </div>

      <div className="adjustment-section">
        <h3>
          <Palette size={18} />
          Color
        </h3>
        {colorAdjustments.map((config) => {
          const IconComponent = getIcon(config.icon)
          return (
            <div key={config.key} className="adjustment-item">
              <div className="adjustment-label">
                <span>
                  <IconComponent size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  {config.label}
                </span>
                <span className="adjustment-value">
                  {adjustments[config.key] > 0 ? '+' : ''}{adjustments[config.key]}
                </span>
              </div>
              <CustomSlider
                value={adjustments[config.key]}
                min={config.min}
                max={config.max}
                step={config.step}
                onChange={(value) => onAdjustmentChange(config.key, value)}
              />
            </div>
          )
        })}
      </div>

      <button className="reset-button" onClick={onReset}>
        <RotateCcw size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Reset All
      </button>
    </div>
  )
}

export default AdjustmentPanel
