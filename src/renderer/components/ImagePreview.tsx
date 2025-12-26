import React from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { ProcessedImage, ImageAdjustments } from '../types'

interface ImagePreviewProps {
  selectedImage: string | null
  processedImages: ProcessedImage[]
  adjustments: ImageAdjustments
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  selectedImage,
  processedImages,
  adjustments
}) => {
  if (!selectedImage) {
    return (
      <div className="image-preview">
        <div className="placeholder">
          <ImageIcon size={64} />
          <p>Select an image to preview</p>
        </div>
      </div>
    )
  }

  // Find the processed version of the selected image
  const processedImage = processedImages.find(img => img.original === selectedImage)

  return (
    <div className="image-preview">
      <img
        src={processedImage?.processed || `file://${selectedImage}`}
        alt="Image preview"
        onError={(e) => {
          // Fallback to original image if processed version fails
          e.currentTarget.src = `file://${selectedImage}`
        }}
      />
    </div>
  )
}

export default ImagePreview
