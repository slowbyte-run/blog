import { bindZoomEvents, resetZoom } from './lightbox-zoom';

export function bindPanAndToggleEvents(
  container: HTMLElement,
  img: HTMLImageElement,
) {
  img.addEventListener('dblclick', (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('markdown-image-lightbox-img')) return;

    e.preventDefault();
    e.stopPropagation();

    const currentTransform = img.style.transform;
    if (currentTransform && currentTransform !== '') {
      resetZoom(img);
      return;
    }

    const rect = img.getBoundingClientRect();
    const imgCenterX = rect.left + rect.width / 2;
    const imgCenterY = rect.top + rect.height / 2;
    const translateX = e.clientX - (e.clientX - imgCenterX) * 2 - imgCenterX;
    const translateY = e.clientY - (e.clientY - imgCenterY) * 2 - imgCenterY;
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(2)`;
    img.style.cursor = 'grab';
  });

  let isMouseDragging = false;
  let lastPanPoint = { x: 0, y: 0 };
  let translateX = 0;
  let translateY = 0;

  img.addEventListener('mousedown', (e) => {
    const hasScale =
      img.style.transform.includes('scale(') &&
      !img.style.transform.includes('scale(1)');
    if (hasScale) {
      e.preventDefault();
      isMouseDragging = true;
      lastPanPoint = { x: e.clientX, y: e.clientY };
      img.style.cursor = 'grabbing';
    }
  });

  container.addEventListener('mousemove', (e) => {
    if (!isMouseDragging) return;

    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;
    lastPanPoint = { x: e.clientX, y: e.clientY };

    translateX += deltaX;
    translateY += deltaY;

    const scaleMatch = img.style.transform.match(/scale\(([^)]+)\)/);
    const scale = scaleMatch ? Number(scaleMatch[1]) : 1;
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  });

  const handleMouseUp = () => {
    if (isMouseDragging) {
      isMouseDragging = false;
      img.style.cursor = 'grab';
    }
  };

  container.addEventListener('mouseup', handleMouseUp);
  container.addEventListener('mouseleave', handleMouseUp);

  bindZoomEvents(container, img);
}
