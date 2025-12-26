import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Folder operations
  openFolder: () => ipcRenderer.invoke('open-folder'),
  getImages: (folderPath: string) => ipcRenderer.invoke('get-images', folderPath),
  
  // Image processing
  processImage: (imagePath: string, adjustments: any) => 
    ipcRenderer.invoke('process-image', imagePath, adjustments),
  
  // Export operations
  exportImages: (images: any[], adjustments: any, exportPath: string) => 
    ipcRenderer.invoke('export-images', images, adjustments, exportPath),
  
  // Event listeners
  onExportLocationSelected: (callback: (exportPath: string) => void) => 
    ipcRenderer.on('export-location-selected', (event, exportPath) => callback(exportPath))
})

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      openFolder: () => Promise<string | null>
      getImages: (folderPath: string) => Promise<string[]>
      processImage: (imagePath: string, adjustments: any) => Promise<string | null>
      exportImages: (images: any[], adjustments: any, exportPath: string) => Promise<boolean>
      onExportLocationSelected: (callback: (exportPath: string) => void) => void
    }
  }
}
