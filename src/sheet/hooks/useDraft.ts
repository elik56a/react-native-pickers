import { useCallback, useRef, useState } from 'react';

import { FIELD_PRESENTATION } from '../sheet.constants';
import type { DraftOptions } from '../sheet.types';
import { useFieldSheet } from './useFieldSheet';

/**
 * Draft state that resets to `value` every time the sheet opens, and whenever `resetKey` changes (e.g. a new mode), open or not.
 * In an `inline` field there's no Done button, so each change also goes to `commit`.
 */
export const useDraft = <V>(value: V, visible: boolean, { resetKey, commit }: DraftOptions<V> = {}): [V, (v: V) => void] => {
  const [draft, setDraft] = useState(value);
  const [wasVisible, setWasVisible] = useState(visible);
  const [key, setKey] = useState(resetKey);
  const inline = useFieldSheet()?.presentation === FIELD_PRESENTATION.inline;
  const liveCommit = useRef(commit);
  liveCommit.current = inline ? commit : undefined;
  const update = useCallback((next: V) => {
    setDraft(next);
    liveCommit.current?.(next);
  }, []);
  const opening = visible && !wasVisible;
  const rekeyed = resetKey !== key;
  if (visible !== wasVisible || rekeyed) {
    setWasVisible(visible);
    setKey(resetKey);
  }
  if (opening || rekeyed) {
    setDraft(value);
    // A field keeps its sheet mounted while closed, so the rest of this render must already see the reset draft.
    return [value, update];
  }
  return [draft, update];
};
