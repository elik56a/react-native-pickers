import { useEffect, useMemo, useRef } from 'react';
import type { FlatList } from 'react-native';

import { normalizeItem } from '../../wheel/wheel.utils';
import { TIME_CELL_HEIGHT } from '../time.constants';
import type { TimePanelColumn } from '../time.types';
import { getPanelTopRow } from '../time.utils';

/** A panel column's cells, which one is chosen, and a list that keeps it in the middle, with its neighbours either side. */
export const useTimePanelColumn = (column: TimePanelColumn, visibleRows: number) => {
  const items = useMemo(() => column.items.map(normalizeItem), [column.items]);
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === column.value)
  );
  const topRow = getPanelTopRow(selectedIndex, items.length, visibleRows);
  const ref = useRef<FlatList<(typeof items)[number]>>(null);
  const mounted = useRef(false);

  // initialScrollIndex alone can miss on the web when the list lays out late, so the first render scrolls too, without animating.
  useEffect(() => {
    ref.current?.scrollToOffset({ offset: topRow * TIME_CELL_HEIGHT, animated: mounted.current });
    mounted.current = true;
  }, [topRow]);

  return {
    ref,
    items,
    selected: column.value,
    initialIndex: topRow,
    getItemLayout: (_: unknown, index: number) => ({
      length: TIME_CELL_HEIGHT,
      offset: TIME_CELL_HEIGHT * index,
      index,
    }),
  };
};
