import { useState } from 'react';

import { useControllableState } from '../../core/hooks/useControllableState';

interface SheetRecentOptions {
  visible: boolean;
  closeOnSelect: boolean;
  recent?: string[];
  defaultRecent?: string[];
  onRecentChange?: (recent: string[]) => void;
}

/**
 * Recents kept by the sheet, which outlives the picker inside it, so they last between openings. A pick that closes the
 * sheet still records the emoji, but the grid keeps the recents it opened with until it has faded out, instead of
 * jumping as the new one is added; it shows them on the next open, as the iOS emoji keyboard does.
 */
export const useSheetRecent = ({ visible, closeOnSelect, recent, defaultRecent, onRecentChange }: SheetRecentOptions) => {
  const [value, setValue] = useControllableState(recent, defaultRecent ?? [], onRecentChange);
  const [shown, setShown] = useState<string[] | null>(null);
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setShown(null);
  }

  const change = (next: string[]) => {
    if (closeOnSelect) setShown(value);
    setValue(next);
  };

  return {
    recent: shown ?? value,
    onRecentChange: change,
  };
};
