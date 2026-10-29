import { useState } from 'react';

/** Which drawer sections are open, by label; tapping a header opens or folds it. */
export const useCollapsible = (initiallyOpen: () => readonly string[]) => {
  const [open, setOpen] = useState(() => new Set(initiallyOpen()));

  const toggle = (key: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return {
    isOpen: (key: string) => open.has(key),
    toggle,
  };
};
