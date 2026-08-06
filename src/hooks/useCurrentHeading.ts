import { useMemo, useSyncExternalStore } from 'react';
import { createHeadingStore } from './useCurrentHeading/store';

export interface CurrentHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface UseCurrentHeadingOptions {
  offsetTop?: number;
}

export function useCurrentHeading({
  offsetTop = 80,
}: UseCurrentHeadingOptions = {}): CurrentHeading | null {
  const store = useMemo(() => createHeadingStore(offsetTop), [offsetTop]);

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
