interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  lastPinchDistance: number;
  isPinching: boolean;
  isPanning: boolean;
  isMouseDragging: boolean;
  lastPanPoint: { x: number; y: number };
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;

function getInitialZoomState(): ZoomState {
  return {
    scale: 1,
    translateX: 0,
    translateY: 0,
    lastPinchDistance: 0,
    isPinching: false,
    isPanning: false,
    isMouseDragging: false,
    lastPanPoint: { x: 0, y: 0 },
  };
}

let zoomState = getInitialZoomState();

function getTouchDistance(touches: TouchList): number {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenter(touches: TouchList): { x: number; y: number } {
  if (touches.length < 2) {
    return { x: touches[0].clientX, y: touches[0].clientY };
  }
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

function clampTranslation(img: HTMLImageElement): void {
  if (zoomState.scale <= 1) return;

  const rect = img.getBoundingClientRect();
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  const maxX = Math.max(
    0,
    (rect.width - containerWidth) / 2 + containerWidth * 0.3,
  );
  const maxY = Math.max(
    0,
    (rect.height - containerHeight) / 2 + containerHeight * 0.3,
  );

  zoomState.translateX = Math.max(-maxX, Math.min(maxX, zoomState.translateX));
  zoomState.translateY = Math.max(-maxY, Math.min(maxY, zoomState.translateY));
}

function applyZoomTransform(img: HTMLImageElement): void {
  clampTranslation(img);
  const { scale, translateX, translateY } = zoomState;
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  img.style.cursor =
    scale > 1 ? (zoomState.isMouseDragging ? 'grabbing' : 'grab') : 'zoom-in';
}

export function resetZoom(img: HTMLImageElement | null): void {
  zoomState = getInitialZoomState();
  if (img) {
    img.style.transform = '';
    img.style.cursor = 'zoom-in';
  }
}

export function bindZoomEvents(
  container: HTMLElement,
  img: HTMLImageElement,
): void {
  container.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        zoomState.isPinching = true;
        zoomState.lastPinchDistance = getTouchDistance(e.touches);
      } else if (e.touches.length === 1 && zoomState.scale > 1) {
        zoomState.isPanning = true;
        zoomState.lastPanPoint = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    },
    { passive: false },
  );

  container.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 2 && zoomState.isPinching) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        const scaleDelta = currentDistance / zoomState.lastPinchDistance;
        let newScale = zoomState.scale * scaleDelta;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        if (newScale !== zoomState.scale) {
          const center = getTouchCenter(e.touches);
          const rect = img.getBoundingClientRect();
          const imgCenterX = rect.left + rect.width / 2;
          const imgCenterY = rect.top + rect.height / 2;
          const scaleRatio = newScale / zoomState.scale;

          zoomState.translateX =
            center.x -
            (center.x - imgCenterX - zoomState.translateX) * scaleRatio -
            imgCenterX;
          zoomState.translateY =
            center.y -
            (center.y - imgCenterY - zoomState.translateY) * scaleRatio -
            imgCenterY;

          zoomState.scale = newScale;
          applyZoomTransform(img);
        }

        zoomState.lastPinchDistance = currentDistance;
      } else if (
        e.touches.length === 1 &&
        zoomState.isPanning &&
        zoomState.scale > 1
      ) {
        e.preventDefault();
        const deltaX = e.touches[0].clientX - zoomState.lastPanPoint.x;
        const deltaY = e.touches[0].clientY - zoomState.lastPanPoint.y;

        zoomState.translateX += deltaX;
        zoomState.translateY += deltaY;
        zoomState.lastPanPoint = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };

        applyZoomTransform(img);
      }
    },
    { passive: false },
  );

  container.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) zoomState.isPinching = false;
    if (e.touches.length === 0) {
      zoomState.isPanning = false;
      if (zoomState.scale > 1) {
        img.style.cursor = 'grab';
      }
    }

    if (zoomState.scale < 1.05) {
      resetZoom(img);
    }
  });

  container.addEventListener(
    'wheel',
    (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      let newScale = zoomState.scale * delta;
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      if (newScale !== zoomState.scale) {
        const rect = img.getBoundingClientRect();
        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;
        const scaleRatio = newScale / zoomState.scale;
        zoomState.translateX =
          e.clientX -
          (e.clientX - imgCenterX - zoomState.translateX) * scaleRatio -
          imgCenterX;
        zoomState.translateY =
          e.clientY -
          (e.clientY - imgCenterY - zoomState.translateY) * scaleRatio -
          imgCenterY;

        zoomState.scale = newScale;
        applyZoomTransform(img);
      }

      if (zoomState.scale < 1.05) {
        resetZoom(img);
      }
    },
    { passive: false },
  );
}
