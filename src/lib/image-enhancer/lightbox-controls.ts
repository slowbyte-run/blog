/**
 * 兼容占位模块，避免旧引用导致构建失败。
 */

export function getLightbox(): HTMLElement | null {
  return document.querySelector('.markdown-image-lightbox');
}

export function openLightbox(): void {
  // no-op
}

export function closeLightbox(): void {
  // no-op
}

export function cleanupLightboxListeners(): void {
  // no-op
}
