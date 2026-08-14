import { useEffect, useState } from 'react';

/**
 * A custom hook that debounces a value after a given delay.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds. Defaults to 300ms.
 * @returns The debounced value.
 */
export function useDebounce(value: string, delay = 300): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebounced(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay],
  );

  return debounced;
}