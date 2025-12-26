import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Download, Image as ImageIcon, Sliders } from 'lucide-react'
import ImagePreview from './components/ImagePreview'
import AdjustmentPanel from './components/AdjustmentPanel'
import ImageGrid from './components/ImageGrid'
import { ImageAdjustments, ProcessedImage } from './types'

const defaultAdjustments: ImageAdjustments = {
  brightness: 0,
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  vignette: 0,
  saturation: 0,
  warmth: 0,
  tint: 0,
  sharpness: 0
}

const App: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(defaultAdjustments)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAdjustments, setShowAdjustments] = useState(true)

  const openFolder = async () => {
    try {
      const folderPath = await window.electronAPI.openFolder()
      if (folderPath) {
        setCurrentFolder(folderPath)
        const imageFiles = await window.electronAPI.getImages(folderPath)
        setImages(imageFiles)
        setProcessedImages([])
        if (imageFiles.length > 0) {
          setSelectedImage(imageFiles[0])
        }
      }
    } catch (error) {
      console.error('Error opening folder:', error)
    }
  }

  const processSelectedImage = useCallback(async (imagePath: string) => {
    if (!imagePath) return

    setIsProcessing(true)
    try {
      const processedData = await window.electronAPI.processImage(imagePath, adjustments)
      if (processedData) {
        setProcessedImages(prev => {
          const filtered = prev.filter(img => img.original !== imagePath)
          return [...filtered, {
            original: imagePath,
            processed: processedData,
            adjustments: { ...adjustments }
          }]
        })
      }
    } catch (error) {
      console.error('Error processing image:', imagePath, error)
    }
    setIsProcessing(false)
  }, [adjustments])

  const processAllImages = useCallback(async () => {
    if (images.length === 0) return

    setIsProcessing(true)
    const processed: ProcessedImage[] = []

    for (const imagePath of images) {
      try {
        const processedData = await window.electronAPI.processImage(imagePath, adjustments)
        if (processedData) {
          processed.push({
            original: imagePath,
            processed: processedData,
            adjustments: { ...adjustments }
          })
        }
      } catch (error) {
        console.error('Error processing image:', imagePath, error)
      }
    }

    setProcessedImages(processed)
    setIsProcessing(false)
  }, [images, adjustments])

  const exportImages = async () => {
    if (images.length === 0) return

    try {
      // For now, we'll use a default export path. In a real app, you'd show a dialog.
      const exportPath = currentFolder ? `${currentFolder}/edited` : './edited'
      const success = await window.electronAPI.exportImages(images, adjustments, exportPath)
      
      if (success) {
        // Show success notification
        console.log('Images exported successfully!')
      }
    } catch (error) {
      console.error('Error exporting images:', error)
    }
  }

  const handleAdjustmentChange = (key: keyof ImageAdjustments, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetAdjustments = () => {
    setAdjustments(defaultAdjustments)
  }

  // Process only selected image when adjustments change (optimized!)
  useEffect(() => {
    if (selectedImage) {
      const debounceTimer = setTimeout(() => {
        processSelectedImage(selectedImage)
      }, 300) // Debounce for better performance

      return () => clearTimeout(debounceTimer)
    }
  }, [adjustments, selectedImage, processSelectedImage])

  return (
    <div className="app">
      {/* Title Bar */}
      <div className="title-bar">
        <div className="title-bar-content">
          <ImageIcon size={20} />
          <span>Massive Image Editor</span>
        </div>
        <div className="title-bar-controls">
          <button onClick={() => setShowAdjustments(!showAdjustments)} className="control-button">
            <Sliders size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {!currentFolder ? (
          <div className="welcome-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="welcome-content"
            >
              <ImageIcon size={64} className="welcome-icon" />
              <h1>Welcome to Massive Image Editor</h1>
              <p>Select a folder containing images to get started</p>
              <button onClick={openFolder} className="primary-button">
                <FolderOpen size={20} />
                Open Folder
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="editor-layout">
            {/* Image Grid */}
            <div className="image-grid-container">
              <div className="toolbar">
                <button onClick={openFolder} className="toolbar-button">
                  <FolderOpen size={16} />
                  Change Folder
                </button>
                <button onClick={processAllImages} className="toolbar-button" disabled={images.length === 0 || isProcessing}>
                  <Sliders size={16} />
                  Apply to All
                </button>
                <button onClick={exportImages} className="toolbar-button" disabled={images.length === 0}>
                  <Download size={16} />
                  Export All
                </button>
                <span className="image-count">{images.length} images</span>
              </div>
              
              <ImageGrid
                images={images}
                processedImages={processedImages}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                isProcessing={isProcessing}
              />
            </div>

            {/* Main Preview */}
            <div className="preview-container">
              <ImagePreview
                selectedImage={selectedImage}
                processedImages={processedImages}
                adjustments={adjustments}
              />
            </div>

            {/* Adjustment Panel */}
            <AnimatePresence>
              {showAdjustments && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="adjustment-panel-container"
                >
                  <AdjustmentPanel
                    adjustments={adjustments}
                    onAdjustmentChange={handleAdjustmentChange}
                    onReset={resetAdjustments}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
