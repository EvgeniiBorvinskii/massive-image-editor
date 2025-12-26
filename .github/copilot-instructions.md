# Lone Star Image Editor - Copilot Instructions

This project is a Windows 11 style photo editor application built with Electron, React, and TypeScript.

## Project Overview
- **Type**: Cross-platform desktop application (Electron + React + TypeScript)
- **Theme**: Dark theme matching Windows 11 Fluent Design language
- **Core Feature**: Batch processing of images in folders with real-time preview
- **UI**: Modern sliders for image adjustments with smooth animations
- **Performance**: Optimized for maximum performance using Sharp.js for image processing

## Architecture
- **Main Process**: Electron main process handles file system operations and image processing
- **Renderer Process**: React application for the user interface
- **IPC Communication**: Secure communication via contextIsolation and preload scripts
- **Build System**: Vite for renderer, TypeScript for main process

## Key Features Implemented
1. **Image Adjustments**: Brightness, Exposure, Contrast, Highlights, Shadows, Vignette
2. **Color Adjustments**: Saturation, Warmth, Tint, Sharpness
3. **Batch Processing**: Apply settings to all images in a folder simultaneously
4. **Modern UI**: Windows 11 Fluent Design with dark theme and smooth animations
5. **Real-time Preview**: Live preview of adjustments with debounced processing
6. **High Performance**: Optimized image processing pipeline with Sharp.js
7. **Export Functionality**: Save processed images with quality preservation

## Technical Stack
- **Frontend**: React 18 + TypeScript + Framer Motion for animations
- **Backend**: Electron with Node.js for file system and image processing
- **Image Processing**: Sharp.js for high-performance image operations
- **Build Tools**: Vite for renderer, TypeScript compiler for main process
- **Styling**: CSS with Windows 11 design principles
- **Icons**: Lucide React icon library

## File Structure
```
src/
├── main/                    # Electron main process
│   ├── index.ts            # Main application entry point
│   └── preload.ts          # Secure IPC preload script
└── renderer/               # React renderer process
    ├── App.tsx            # Main React component
    ├── main.tsx           # React entry point
    ├── components/        # UI components
    ├── styles/           # CSS styles
    └── types/            # TypeScript type definitions
```

## Build Commands
- `npm run build:main` - Compile main process
- `npm run build:renderer` - Build renderer with Vite
- `npm run build` - Build both processes
- `npx electron dist/main/index.js` - Run the application

## Development Guidelines
- Follow Windows 11 design principles for UI consistency
- Use TypeScript for type safety
- Implement proper error handling for file operations
- Optimize image processing for performance
- Maintain security with proper IPC isolation
- Use React best practices with hooks and functional components

## Project Status
✅ Project scaffolding complete
✅ Core features implemented
✅ Build system configured
✅ Application successfully launches
✅ Documentation complete

The application is ready for use and can process images with various adjustments in batch mode with a modern Windows 11-style interface.
