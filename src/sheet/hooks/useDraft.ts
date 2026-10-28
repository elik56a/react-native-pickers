import { useState } from 'react';

/** Draft state that resets to `value` every time the sheet opens, and when `resetKey` changes while it's open (e.g. a new mode). */
export const useDraft = <V>(value: V, visible: boolean, resetKey?: unknown): [V, (v: V) => void] => {
  const [draft, setDraft] = useState(value);
  const [wasVisible, setWasVisible] = useState(visible);
  const [key, setKey] = useState(resetKey);
  if (visible !== wasVisible || resetKey !== key) {
    setWasVisible(visible);
    setKey(resetKey);
    if (visible) setDraft(value);
  }
  return [draft, setDraft];
};
