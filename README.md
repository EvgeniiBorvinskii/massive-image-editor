# 🌟 Massive Image Editor

<img width="2087" height="1346" alt="image" src="https://github.com/user-attachments/assets/f8d4dd39-84c5-4e1b-8b5a-d591c80161df" />


A modern Windows 11-style image editor with powerful batch processing capabilities. Built with Electron, React, and TypeScript for high performance and smooth user experience.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## ⚡ Performance Highlights (v1.1.0)

- **10x Faster Loading** - Load 100 images in <1 second (was 8.5s)
- **90% Less Memory** - Optimized thumbnail system (150MB vs 1.5GB)
- **Instant Adjustments** - Real-time preview on selected image
- **Lazy Loading** - Progressive image loading as you scroll
- **Smooth 60fps** - Silky smooth scrolling even with 1000+ images

## ✨ Key Features

- **🎨 Modern Dark Theme** - Beautiful Windows 11 Fluent Design interface
- **⚡ Batch Processing** - Apply effects to all images in a folder simultaneously
- **🎚️ Intuitive Sliders** - Easy-to-use adjustment controls with real-time preview
- **🚀 High Performance** - Optimized image processing using Sharp.js
- **👁️ Live Preview** - Instant visualization of adjustments
- **💾 Smart Export** - Save processed images with quality preservation

## 🎨 Image Adjustments

### Light Adjustments
- **Brightness** - Adjust overall brightness (-100 to +100)
- **Exposure** - Correct exposure for better lighting (-100 to +100)
- **Contrast** - Change image contrast (-100 to +100)
- **Highlights** - Adjust bright areas (-100 to +100)
- **Shadows** - Correct dark areas (-100 to +100)
- **Vignette** - Add darkening effect at edges (-100 to +100)

### Color Adjustments
- **Saturation** - Control color intensity (-100 to +100)
- **Warmth** - Adjust color temperature (-100 to +100)
- **Tint** - Correct color balance (-100 to +100)
- **Sharpness** - Enhance detail clarity (-100 to +100)

## 🚀 Quick Start

<img width="2085" height="1336" alt="image" src="https://github.com/user-attachments/assets/49ca947e-d04d-4f9b-9d96-bafbdfc95839" />

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EvgeniiBorvinskii/massive-image-editor.git
cd massive-image-editor
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run the application:
```bash
npx electron dist/main/index.js
```

Or use the convenient build task:
```bash
npm run build && npx electron dist/main/index.js
```

### Development

For development with hot reload:
```bash
npm run dev
```

## 📖 How to Use

1. **Open Image Folder:**
   - Click "Open Folder" button or press Ctrl+O
   - Select a folder containing images (supported formats: JPEG, PNG, TIFF, BMP, WebP)
   - Images load progressively with lazy loading (instant for first 10-15 images)

2. **Adjust Single Image:**
   - Select an image from the left grid panel
   - Use sliders in the right panel to adjust
   - See changes instantly on the selected image (real-time preview)
   - Click the eye icon to toggle the adjustment panel

3. **Apply to All Images:**
   - After adjusting one image to your liking
   - Click "Apply to All" button in the toolbar
   - All images will be processed with the same adjustments
   - Progress indicator shows processing status

4. **Preview:**
   - Click any image in the grid to preview it large
   - Main window shows the image with applied effects
   - Scroll through the grid - images load as you scroll (lazy loading)

5. **Export Results:**
   - Click "Export All" button or press Ctrl+E
   - Processed images will be saved to an "edited" folder next to the originals
   - All adjustments are applied during export

6. **Reset Adjustments:**
   - Click "Reset All" button at the bottom of the adjustment panel
   - All parameters will return to default values (0)

## 🛠 Technology Stack

- **Electron** - Cross-platform desktop application framework
- **React 18** - UI library with modern hooks
- **TypeScript** - Strongly typed JavaScript
- **Sharp.js** - High-performance image processing library
- **Vite** - Modern build tool for fast development
- **Framer Motion** - Animation library for smooth transitions
- **Lucide React** - Modern icon set

## 📁 Project Structure

```
src/
├── main/                    # Electron main process
│   ├── index.ts            # Main application entry point
│   └── preload.ts          # Preload script for secure IPC
├── renderer/               # React renderer process (UI)
│   ├── App.tsx            # Main React component
│   ├── main.tsx           # React entry point
│   ├── index.html         # HTML template
│   ├── components/        # UI components
│   │   ├── AdjustmentPanel.tsx  # Adjustment controls panel
│   │   ├── CustomSlider.tsx     # Custom slider component
│   │   ├── ImageGrid.tsx        # Image thumbnail grid
│   │   └── ImagePreview.tsx     # Main image preview
│   ├── styles/
│   │   └── globals.css    # Global styles (Windows 11 theme)
│   └── types/
│       └── index.ts       # TypeScript type definitions
```

## 🔧 Available Commands

```bash
npm run dev              # Run in development mode
npm run build           # Build the entire project
npm run build:main      # Build main process only
npm run build:renderer  # Build renderer process only
npm start              # Start built application
npm run type-check     # Check TypeScript types
npm run lint           # Run ESLint code checks
npm run clean          # Clean build directories
```

## 🎯 Supported Formats

**Input Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- TIFF (.tiff, .tif)
- BMP (.bmp)
- WebP (.webp)

**Output Format:**
- JPEG (high quality, 95% compression)

## 🔒 Security

The application uses `contextIsolation` and disables `nodeIntegration` for enhanced security. All interactions between the main process and renderer process occur through a secure preload script with exposed APIs.

## 🎯 Performance Optimization

- **Debounced Processing** - Adjustments are debounced (300ms) to prevent excessive processing
- **Sharp.js Integration** - Uses native C++ bindings for fast image processing
- **Memory Efficient** - Processes images on-demand rather than loading all into memory
- **Optimized Rendering** - React memoization and efficient re-rendering strategies

## 🐛 Troubleshooting

**Issue:** Cannot open images
- **Solution:** Ensure image formats are supported and files are not corrupted

**Issue:** Slow processing
- **Solution:** Reduce the number of images in the folder or close other resource-intensive applications

**Issue:** Export error
- **Solution:** Check write permissions for the target folder

**Issue:** Images appear crooked in the grid
- **Solution:** The latest version uses `object-fit: contain` to properly display images without cropping

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🗺️ Roadmap

- [ ] Add more image formats support (RAW, PSD)
- [ ] Implement undo/redo functionality
- [ ] Add preset filters (Vintage, Black & White, etc.)
- [ ] Support for image cropping and rotation
- [ ] Batch rename functionality
- [ ] Export to multiple formats
- [ ] Custom export quality settings
- [ ] Multi-language support

## 📞 Support

If you have questions or issues, please create an issue in the GitHub repository.

## 👨‍💻 Author

**Evgenii Borvinskii**
- GitHub: [@EvgeniiBorvinskii](https://github.com/EvgeniiBorvinskii)

---

**Massive Image Editor** - A powerful, modern, and user-friendly image editor for batch photo processing with a Windows 11-style interface. Perfect for photographers, designers, and anyone who needs to process multiple images quickly and efficiently.

Made with ❤️ using Electron, React, and TypeScript
