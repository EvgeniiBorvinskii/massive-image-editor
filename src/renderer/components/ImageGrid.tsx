import React, { useEffect, useRef, useState } from 'react'
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
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map())
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const imageRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Load thumbnails for visible images
  useEffect(() => {
    const loadThumbnails = async () => {
      for (const imagePath of visibleImages) {
        if (!thumbnails.has(imagePath)) {
          try {
            const thumbnail = await window.electronAPI.generateThumbnail(imagePath)
            if (thumbnail) {
              setThumbnails(prev => new Map(prev).set(imagePath, thumbnail))
            }
          } catch (error) {
            console.error('Error loading thumbnail:', error)
          }
        }
      }
    }

    loadThumbnails()
  }, [visibleImages])

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const imagePath = entry.target.getAttribute('data-image-path')
          if (imagePath) {
            if (entry.isIntersecting) {
              setVisibleImages(prev => new Set(prev).add(imagePath))
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '100px', // Load images 100px before they become visible
        threshold: 0.01
      }
    )

    // Observe all image elements
    imageRefs.current.forEach((element) => {
      if (observerRef.current && element) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [images])

  const getImageSrc = (imagePath: string): string => {
    // First check if there's a processed version
    const processedImage = processedImages.find(img => img.original === imagePath)
    if (processedImage?.processed) {
      return processedImage.processed
    }
    
    // Then check if we have a thumbnail
    const thumbnail = thumbnails.get(imagePath)
    if (thumbnail) {
      return thumbnail
    }
    
    // Fallback to a placeholder
    return ''
  }

  const getImageName = (imagePath: string): string => {
    return imagePath.split(/[\\\/]/).pop()?.split('.')[0] || 'Unknown'
  }

  const setImageRef = (imagePath: string) => (element: HTMLDivElement | null) => {
    if (element) {
      imageRefs.current.set(imagePath, element)
      if (observerRef.current) {
        observerRef.current.observe(element)
      }
    } else {
      imageRefs.current.delete(imagePath)
    }
  }

  return (
    <div className="image-grid">
      {images.map((imagePath) => {
        const src = getImageSrc(imagePath)
        const isLoaded = thumbnails.has(imagePath) || processedImages.some(img => img.original === imagePath)
        
        return (
          <div
            key={imagePath}
            ref={setImageRef(imagePath)}
            data-image-path={imagePath}
            className={`image-item ${selectedImage === imagePath ? 'selected' : ''}`}
            onClick={() => onImageSelect(imagePath)}
            title={getImageName(imagePath)}
          >
            {isLoaded && src ? (
              <img
                src={src}
                alt={getImageName(imagePath)}
                onError={(e) => {
                  // Fallback to original image if thumbnail fails
                  e.currentTarget.src = `file://${imagePath}`
                }}
              />
            ) : (
              <div className="loading-overlay">
                <Loader size={16} className="loading-spinner" />
              </div>
            )}
            {isProcessing && selectedImage === imagePath && (
              <div className="loading-overlay">
                <Loader size={16} className="loading-spinner" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ImageGrid
