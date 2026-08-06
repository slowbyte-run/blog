import { bindPanAndToggleEvents } from './lightbox-pan';
import { resetZoom } from './lightbox-zoom';

let lightboxImg: HTMLImageElement | null = null;

function handleLightboxKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    closeLightbox();
  }
}

function createLightbox(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'markdown-image-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '图片全屏查看');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'markdown-image-lightbox-close';
  closeBtn.setAttribute('type', 'button');
  closeBtn.setAttribute('aria-label', '关闭');
  closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  const imgContainer = document.createElement('div');
  imgContainer.className = 'markdown-image-lightbox-content';

  const img = document.createElement('img');
  img.className = 'markdown-image-lightbox-img';
  lightboxImg = img;

  imgContainer.appendChild(img);
  overlay.appendChild(closeBtn);
  overlay.appendChild(imgContainer);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === imgContainer) {
      closeLightbox();
    }
  });

  closeBtn.addEventListener('click', closeLightbox);
  bindPanAndToggleEvents(imgContainer, img);

  return overlay;
}

function getLightbox(): HTMLElement {
  let overlay = document.querySelector('.markdown-image-lightbox');
  if (!overlay) {
    overlay = createLightbox();
    document.body.appendChild(overlay);
  } else {
    lightboxImg = overlay.querySelector('.markdown-image-lightbox-img');
  }
  return overlay as HTMLElement;
}

export function openLightbox(imgSrc: string, imgAlt: string): void {
  const overlay = getLightbox();

  resetZoom(lightboxImg);
  if (!lightboxImg) return;

  lightboxImg.classList.remove('loaded');
  lightboxImg.src = '';

  lightboxImg.alt = imgAlt;
  lightboxImg.src = imgSrc;

  lightboxImg.onload = () => {
    lightboxImg?.classList.add('loaded');
  };

  overlay.classList.add('active');
  document.body.classList.add('lightbox-open');
  document.addEventListener('keydown', handleLightboxKeydown);
}

export function closeLightbox(): void {
  const overlay = document.querySelector('.markdown-image-lightbox');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', handleLightboxKeydown);
    resetZoom(lightboxImg);
  }
}
