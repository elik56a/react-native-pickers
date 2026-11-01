import { useEffect, useState } from 'react';

/** `value`, `delay` ms late; at once when `delay` is 0. */
export const useDelayedValue = <T>(value: T, delay: number) => {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!delay) {
      setShown(value);
      return;
    }
    const timer = setTimeout(() => setShown(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return shown;
};
