import { useState } from 'react';

/** Draft state that resets to `value` every time the sheet opens. */
export const useDraft = <V>(value: V, visible: boolean): [V, (v: V) => void] => {
  const [draft, setDraft] = useState(value);
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft(value);
  }
  return [draft, setDraft];
};
