import { useState } from 'react';

/** Draft state that resets to `value` every time the sheet opens, and whenever `resetKey` changes (e.g. a new mode), open or not. */
export const useDraft = <V>(value: V, visible: boolean, resetKey?: unknown): [V, (v: V) => void] => {
  const [draft, setDraft] = useState(value);
  const [wasVisible, setWasVisible] = useState(visible);
  const [key, setKey] = useState(resetKey);
  const opening = visible && !wasVisible;
  const rekeyed = resetKey !== key;
  if (visible !== wasVisible || rekeyed) {
    setWasVisible(visible);
    setKey(resetKey);
  }
  if (opening || rekeyed) {
    setDraft(value);
    // A field keeps its sheet mounted while closed, so the rest of this render must already see the reset draft.
    return [value, setDraft];
  }
  return [draft, setDraft];
};
