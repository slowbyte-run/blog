export function useIsMounted() {
  return typeof window !== 'undefined';
}
