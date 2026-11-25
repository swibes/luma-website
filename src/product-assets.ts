// Paths are relative to public/assets/. Leave unset until approved captures exist.
export interface ProductScreenshot {
  path: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}
export const productAssets: { hero?: ProductScreenshot } = {};
