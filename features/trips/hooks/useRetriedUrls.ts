import { useCallback, useRef } from 'react';

/** Remembers the failed image URLs already retried: `isFirstRetry(url)` is true once per URL. */
export const useRetriedUrls = () => {
  const retried = useRef(new Set<string>());

  return useCallback((url: string) => {
    if (retried.current.has(url)) return false;
    retried.current.add(url);
    return true;
  }, []);
};
