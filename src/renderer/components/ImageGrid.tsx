import React from 'react'
import { Loader } from 'lucide-react'
import { ProcessedImage } from '../types'

interface ImageGridProps {
  images: string[]
  processedImages: ProcessedImage[]
  selectedImage: string | null
  onImageSelect: (image: string) => void
  isProcessing: boolean
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  processedImages,
  selectedImage,
  onImageSelect,
  isProcessing
}) => {
  const getImageSrc = (imagePath: string): string => {
    const processedImage = processedImages.find(img => img.original === imagePath)
    return processedImage?.processed || `file://${imagePath}`
  }

  const getImageName = (imagePath: string): string => {
    return imagePath.split(/[\\\/]/).pop()?.split('.')[0] || 'Unknown'
  }

  return (
    <div className="image-grid">
      {images.map((imagePath, index) => (
        <div
          key={imagePath}
          className={`image-item ${selectedImage === imagePath ? 'selected' : ''}`}
          onClick={() => onImageSelect(imagePath)}
          title={getImageName(imagePath)}
        >
          <img
            src={getImageSrc(imagePath)}
            alt={getImageName(imagePath)}
            onError={(e) => {
              // Fallback to original image if processed version fails
              e.currentTarget.src = `file://${imagePath}`
            }}
          />
          {isProcessing && (
            <div className="loading-overlay">
              <Loader size={16} className="loading-spinner" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
