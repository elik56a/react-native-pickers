import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { canExtend, matchLabel } from '../typeToSelect';
import type { WheelItem } from '../wheel.types';
import { isNumericWheel } from '../wheel.utils';

/** Typing only scrolls the wheel; the wheel's own settle commits the value, exactly like a drag. */
export const useTypeToSelect = <T>(items: WheelItem<T>[], onMatch: (logicalIndex: number) => void) => {
  const [typed, setTyped] = useState<string | null>(null);
  const typing = typed !== null;
  const numeric = useMemo(() => isNumericWheel(items), [items]);

  const stopTyping = useCallback(() => setTyped(null), []);
  const toggleTyping = useCallback(() => setTyped((t) => (t === null ? '' : null)), []);

  const onType = useCallback(
    (text: string) => {
      const query = text.trim().toLowerCase();
      if (!query) return setTyped('');
      const logicalIndex = matchLabel(items, query, numeric);
      if (logicalIndex < 0) return;
      onMatch(logicalIndex);
      setTyped(canExtend(items, query) ? text : null);
    },
    [items, numeric, onMatch]
  );

  useEffect(() => {
    if (!typing) return;
    const sub = Keyboard.addListener('keyboardDidHide', stopTyping);
    return () => sub.remove();
  }, [typing, stopTyping]);

  return {
    typed,
    typing,
    numeric,
    onType,
    stopTyping,
    toggleTyping,
  };
};
