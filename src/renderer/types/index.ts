export interface ImageAdjustments {
  brightness: number      // -100 to 100
  exposure: number        // -100 to 100
  contrast: number        // -100 to 100
  highlights: number      // -100 to 100
  shadows: number         // -100 to 100
  vignette: number        // -100 to 100
  saturation: number      // -100 to 100
  warmth: number          // -100 to 100
  tint: number            // -100 to 100
  sharpness: number       // -100 to 100
}

export interface ProcessedImage {
  original: string
  processed: string
  adjustments: ImageAdjustments
}

export interface SliderConfig {
  key: keyof ImageAdjustments
  label: string
  icon: string
  min: number
  max: number
  step: number
}
