import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import sharp from 'sharp'

class MainApp {
  private mainWindow: BrowserWindow | null = null

  constructor() {
    this.setupApp()
    this.setupIPC()
  }

  private setupApp(): void {
    app.whenReady().then(() => {
      this.createWindow()
      this.setupMenu()

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow()
        }
      })
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1e1e1e',
        symbolColor: '#ffffff'
      },
      backgroundColor: '#1e1e1e',
      show: false
    })

    // Load the renderer
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000')
      this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
    })
  }

  private setupMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Open Folder',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              this.openFolder()
            }
          },
          {
            label: 'Export All',
            accelerator: 'CmdOrCtrl+E',
            click: () => {
              this.exportImages()
            }
          },
          { type: 'separator' },
          {
            label: 'Exit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit()
            }
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }

  private setupIPC(): void {
    ipcMain.handle('open-folder', async () => {
      return await this.openFolder()
    })

    ipcMain.handle('get-images', async (event, folderPath: string) => {
      return await this.getImagesFromFolder(folderPath)
    })

    ipcMain.handle('process-image', async (event, imagePath: string, adjustments: any) => {
      return await this.processImage(imagePath, adjustments)
    })

    ipcMain.handle('export-images', async (event, images: any[], adjustments: any, exportPath: string) => {
      return await this.exportProcessedImages(images, adjustments, exportPath)
    })
  }

  private async openFolder(): Promise<string | null> {
    const result = await dialog.showOpenDialog(this.mainWindow!, {
      properties: ['openDirectory'],
      title: 'Select folder with images'
    })

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
    return null
  }

  private async getImagesFromFolder(folderPath: string): Promise<string[]> {
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.bmp', '.webp']
    
    try {
      const files = await fs.promises.readdir(folderPath)
      return files
        .filter(file => {
          const ext = path.extname(file).toLowerCase()
          return supportedExtensions.includes(ext)
        })
        .map(file => path.join(folderPath, file))
    } catch (error) {
      console.error('Error reading folder:', error)
      return []
    }
  }

  private async processImage(imagePath: string, adjustments: any): Promise<string | null> {
    try {
      let image = sharp(imagePath)
      
      // Apply brightness first
      if (adjustments.brightness !== 0) {
        image = image.modulate({
          brightness: 1 + (adjustments.brightness / 100)
        })
      }
      
      // Apply exposure (similar to brightness but different algorithm)
      if (adjustments.exposure !== 0) {
        // Use gamma correction for exposure
        image = image.gamma(1 + (adjustments.exposure / 200))
      }
      
      // Apply contrast using proper contrast function
      if (adjustments.contrast !== 0) {
        // Convert contrast value to multiplier (0.5 to 2.0)
        const contrastMultiplier = 1 + (adjustments.contrast / 100)
        image = image.linear(contrastMultiplier, -(128 * contrastMultiplier) + 128)
      }
      
      // Apply highlights (lighten bright areas)
      if (adjustments.highlights !== 0) {
        if (adjustments.highlights > 0) {
          // Reduce highlights - darken bright areas
          image = image.modulate({ brightness: 1 - (adjustments.highlights / 200) })
        } else {
          // Increase highlights - brighten bright areas
          image = image.modulate({ brightness: 1 + (Math.abs(adjustments.highlights) / 200) })
        }
      }
      
      // Apply shadows (darken dark areas)
      if (adjustments.shadows !== 0) {
        if (adjustments.shadows > 0) {
          // Lift shadows - brighten dark areas
          image = image.linear(1, adjustments.shadows / 2)
        } else {
          // Deepen shadows - darken dark areas
          image = image.linear(1, adjustments.shadows / 2)
        }
      }
      
      // Apply vignette effect
      if (adjustments.vignette !== 0) {
        // Sharp doesn't have built-in vignette, skip for now
        // TODO: Implement custom vignette using composite
      }
      
      // Apply color adjustments
      if (adjustments.saturation !== 0) {
        image = image.modulate({
          saturation: 1 + (adjustments.saturation / 100)
        })
      }
      
      // Apply warmth (color temperature)
      if (adjustments.warmth !== 0) {
        if (adjustments.warmth > 0) {
          // Warmer - increase red/yellow
          image = image.tint({ r: 255 + adjustments.warmth, g: 255 + adjustments.warmth / 2, b: 255 })
        } else {
          // Cooler - increase blue
          image = image.tint({ r: 255, g: 255, b: 255 + Math.abs(adjustments.warmth) })
        }
      }
      
      // Apply tint (magenta/green balance)
      if (adjustments.tint !== 0) {
        if (adjustments.tint > 0) {
          // More magenta
          image = image.tint({ r: 255 + adjustments.tint / 2, g: 255, b: 255 + adjustments.tint / 2 })
        } else {
          // More green
          image = image.tint({ r: 255, g: 255 + Math.abs(adjustments.tint), b: 255 })
        }
      }
      
      // Apply sharpness
      if (adjustments.sharpness !== 0) {
        if (adjustments.sharpness > 0) {
          image = image.sharpen({ sigma: adjustments.sharpness / 20 })
        } else {
          // Blur for negative sharpness
          image = image.blur(Math.abs(adjustments.sharpness) / 20)
        }
      }

      // Convert to base64 for preview
      const buffer = await image.jpeg({ quality: 90 }).toBuffer()
      return `data:image/jpeg;base64,${buffer.toString('base64')}`
    } catch (error) {
      console.error('Error processing image:', error)
      return null
    }
  }

  private async exportProcessedImages(images: string[], adjustments: any, exportPath: string): Promise<boolean> {
    try {
      // Create export directory if it doesn't exist
      await fs.promises.mkdir(exportPath, { recursive: true })
      
      for (const imagePath of images) {
        const filename = path.basename(imagePath, path.extname(imagePath))
        const exportFilePath = path.join(exportPath, `${filename}_edited.jpg`)
        
        let image = sharp(imagePath)
        
        // Apply the same processing as in processImage
        // Apply brightness first
        if (adjustments.brightness !== 0) {
          image = image.modulate({
            brightness: 1 + (adjustments.brightness / 100)
          })
        }
        
        // Apply exposure
        if (adjustments.exposure !== 0) {
          image = image.gamma(1 + (adjustments.exposure / 200))
        }
        
        // Apply contrast using proper contrast function
        if (adjustments.contrast !== 0) {
          const contrastMultiplier = 1 + (adjustments.contrast / 100)
          image = image.linear(contrastMultiplier, -(128 * contrastMultiplier) + 128)
        }
        
        // Apply highlights
        if (adjustments.highlights !== 0) {
          if (adjustments.highlights > 0) {
            image = image.modulate({ brightness: 1 - (adjustments.highlights / 200) })
          } else {
            image = image.modulate({ brightness: 1 + (Math.abs(adjustments.highlights) / 200) })
          }
        }
        
        // Apply shadows
        if (adjustments.shadows !== 0) {
          image = image.linear(1, adjustments.shadows / 2)
        }
        
        // Apply color adjustments
        if (adjustments.saturation !== 0) {
          image = image.modulate({
            saturation: 1 + (adjustments.saturation / 100)
          })
        }
        
        // Apply warmth
        if (adjustments.warmth !== 0) {
          if (adjustments.warmth > 0) {
            image = image.tint({ r: 255 + adjustments.warmth, g: 255 + adjustments.warmth / 2, b: 255 })
          } else {
            image = image.tint({ r: 255, g: 255, b: 255 + Math.abs(adjustments.warmth) })
          }
        }
        
        // Apply tint
        if (adjustments.tint !== 0) {
          if (adjustments.tint > 0) {
            image = image.tint({ r: 255 + adjustments.tint / 2, g: 255, b: 255 + adjustments.tint / 2 })
          } else {
            image = image.tint({ r: 255, g: 255 + Math.abs(adjustments.tint), b: 255 })
          }
        }
        
        // Apply sharpness
        if (adjustments.sharpness !== 0) {
          if (adjustments.sharpness > 0) {
            image = image.sharpen({ sigma: adjustments.sharpness / 20 })
          } else {
            image = image.blur(Math.abs(adjustments.sharpness) / 20)
          }
        }

        await image.jpeg({ quality: 95 }).toFile(exportFilePath)
      }
      
      return true
    } catch (error) {
      console.error('Error exporting images:', error)
      return false
    }
  }

  private async exportImages(): Promise<void> {
    const result = await dialog.showSaveDialog(this.mainWindow!, {
      title: 'Select export location',
      properties: ['createDirectory']
    })

    if (!result.canceled && result.filePath) {
      this.mainWindow?.webContents.send('export-location-selected', result.filePath)
    }
  }
}

// Initialize the app
new MainApp()
