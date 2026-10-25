import { useCallback, useState } from 'react';

/** Controlled when `value` is defined; otherwise keeps its own state seeded from `defaultValue`. */
export const useControllableState = <T>(
  value: T | undefined,
  defaultValue: T | (() => T),
  onChange?: (next: T) => void
): [T, (next: T) => void] => {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;

  const setValue = useCallback(
    (next: T) => {
      if (!controlled) setInner(() => next);
      onChange?.(next);
    },
    [controlled, onChange]
  );

  return [controlled ? value : inner, setValue];
};
