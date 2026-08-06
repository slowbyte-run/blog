/**
 * 兼容占位模块，旧实现已迁移。
 */

export interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  lastPinchDistance: number;
  isPinching: boolean;
  isPanning: boolean;
  isMouseDragging: boolean;
  lastPanPoint: { x: number; y: number };
}

export const MIN_SCALE = 1;
export const MAX_SCALE = 5;

export function getInitialZoomState(): ZoomState {
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
