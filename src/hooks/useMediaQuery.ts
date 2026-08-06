import { useMediaQuery as useCoreMediaQuery } from '@reactuses/core';

/**
 * Hook for media query matching
 *
 * @param query - Media query string (e.g., "(max-width: 768px)")
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  return useCoreMediaQuery(query, false);
}

/** Mobile (max-width: 768px) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/** Tablet (max-width: 992px) */
export function useIsTablet(): boolean {
  return useMediaQuery('(max-width: 992px)');
}

/** User prefers dark color scheme */
export function usePrefersColorSchemeDark(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/** User prefers reduced motion for accessibility */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
