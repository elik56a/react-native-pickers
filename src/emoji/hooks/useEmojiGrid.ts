import { useCallback, useMemo, useRef, useState } from 'react';
import type { FlatList, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { JUMP_LOCK_MS, SCROLL_PROBE_OFFSET } from '../emoji.constants';
import type { EmojiGridOptions, EmojiRow, EmojiSectionKey } from '../emoji.types';
import {
  buildLayout,
  buildSections,
  filterEmojis,
  getCellSize,
  getRowHeight,
  resolveRecent,
  rowIndexAtOffset,
  sectionOfRow,
} from '../emoji.utils';
import { getAllEmojis } from '../emojis';

/** Search, measured cell size, rows, and the active section kept in sync with scrolling and category jumps. */
export const useEmojiGrid = ({
  recent,
  categories,
  exclude,
  maxEmojiVersion,
  showRecent,
  showSectionHeaders,
  columns,
}: EmojiGridOptions) => {
  const [width, setWidth] = useState(0);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<EmojiSectionKey>(categories[0] ?? 'smileys');
  const listRef = useRef<FlatList<EmojiRow>>(null);
  const jumping = useRef(false);
  const cellSize = getCellSize(width, columns);

  const pool = useMemo(() => filterEmojis(getAllEmojis(), categories, exclude, maxEmojiVersion), [categories, exclude, maxEmojiVersion]);
  const recentEmojis = useMemo(() => resolveRecent(recent, pool), [pool, recent]);
  const layout = useMemo(
    () =>
      buildLayout(
        buildSections({
          query,
          pool,
          recent: recentEmojis,
          showRecent,
          categories,
        }),
        columns,
        cellSize,
        showSectionHeaders
      ),
    [categories, cellSize, columns, pool, query, recentEmojis, showRecent, showSectionHeaders]
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width), []);

  const search = useCallback((text: string) => {
    setQuery(text);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const jumpTo = useCallback(
    (key: EmojiSectionKey) => {
      const index = layout.headerIndex.get(key);
      if (index === undefined) return;
      setActive(key);
      jumping.current = true;
      listRef.current?.scrollToOffset({ offset: layout.offsets[index] ?? 0, animated: true });
      setTimeout(() => {
        jumping.current = false;
      }, JUMP_LOCK_MS);
    },
    [layout]
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (jumping.current || query) return;
      const row = layout.rows[rowIndexAtOffset(layout.offsets, e.nativeEvent.contentOffset.y + SCROLL_PROBE_OFFSET)];
      if (row) setActive(sectionOfRow(row));
    },
    [layout, query]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      index,
      length: getRowHeight(layout.rows[index], cellSize),
      offset: layout.offsets[index] ?? 0,
    }),
    [cellSize, layout]
  );

  return {
    ...layout,
    measured: width > 0,
    cellSize,
    onLayout,
    query,
    search,
    active,
    jumpTo,
    onScroll,
    listRef,
    getItemLayout,
  };
};
