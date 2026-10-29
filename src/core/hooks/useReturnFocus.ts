import { useEffect, useState } from 'react';

import { focusedElement } from '../utils/keyboard.utils';

/**
 * While `open`, remembers what had focus (on the web, the field that opened a sheet) and gives focus back when it closes.
 * It looks while rendering, since by the time effects run an autofocused search field inside has already taken focus.
 */
export const useReturnFocus = (open: boolean) => {
  const [wasOpen, setWasOpen] = useState(false);
  const [opener, setOpener] = useState<ReturnType<typeof focusedElement>>(null);
  if (open !== wasOpen) {
    setWasOpen(open);
    setOpener(open ? focusedElement() : null);
  }
  useEffect(() => {
    if (!open || !opener) return;
    return () => opener.focus();
  }, [open, opener]);
};
