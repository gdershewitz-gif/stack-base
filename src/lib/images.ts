/**
 * Utility to return image URLs cleanly without unnatural cropping or zooming.
 */
export const getOptimizedImageUrl = (
  url?: string,
  _options?: { width?: number; quality?: number; format?: 'webp' | 'jpeg' | 'png' }
): string => {
  if (!url) return '';
  return url;
};
