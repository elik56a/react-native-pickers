import { useState } from 'react';

import type { TimePanelColumn } from '../../time/time.types';
import { parseTypedUnit } from '../duration.utils';

/** The text in each duration box: the column's value, or what's being typed into the focused one until it loses focus. */
export const useDurationInput = () => {
  const [editing, setEditing] = useState<{ key: string; text: string } | null>(null);
  return {
    focused: editing?.key ?? null,
    text: (column: TimePanelColumn) => (editing?.key === column.key ? editing.text : String(column.value ?? 0)),
    focus: (column: TimePanelColumn) =>
      setEditing({
        key: column.key,
        text: String(column.value ?? 0),
      }),
    type: (column: TimePanelColumn, text: string) => {
      setEditing({
        key: column.key,
        text,
      });
      const value = parseTypedUnit(text, column.items);
      if (value !== null && value !== column.value) column.onChange(value);
    },
    blur: () => setEditing(null),
  };
};
