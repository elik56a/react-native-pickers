import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { FlatList, ListViewToken } from 'react-native';

import { useComponentTheme } from '../../core/theme/ThemeProvider';
import { toDateKey } from '../../core/utils/date.utils';
import { TIME_FORMAT } from '../../time/time.constants';
import { is12HourFormat } from '../../time/time.utils';
import { AGENDA_LAYOUT, SCHEDULE_DESIGN, SCROLL_RETRY_MS, SCROLL_SETTLE_MS } from '../schedule.constants';
import type { AgendaProps, AgendaRow, ScheduleEvent } from '../schedule.types';
import { buildAgendaRows, findAgendaDay, resolveScheduleLabels } from '../schedule.utils';
import { useEventInfo } from './useEventInfo';

const VIEWABILITY = { itemVisiblePercentThreshold: 50 };

/** The agenda's rows, the scroll to `selectedDate`, and the day at the top as the user scrolls. */
export const useAgenda = <T extends ScheduleEvent>(props: AgendaProps<T>) => {
  const {
    events,
    selectedDate,
    onVisibleDateChange,
    showEmptyDays = false,
    locale,
    format = TIME_FORMAT.auto,
    labels: labelsProp,
    theme: themeProp,
    design: designProp,
  } = props;
  const { theme } = useComponentTheme(themeProp, designProp);
  const design = SCHEDULE_DESIGN[theme.design];
  const layout = design.agendaLayout;
  const hour12 = is12HourFormat(format, locale);
  const labels = useMemo(() => resolveScheduleLabels(labelsProp), [labelsProp]);
  const today = useMemo(() => new Date(), []);
  const { rows, headerIndices, dayKeys, indexByDay } = useMemo(
    () => buildAgendaRows(events, { withHeaders: layout === AGENDA_LAYOUT.list, showEmptyDays }),
    [events, layout, showEmptyDays]
  );

  const listRef = useRef<FlatList<AgendaRow<T>>>(null);
  /** The day at the top: the one scrolled to, or the one the user scrolled to. */
  const topKey = useRef<string | null>(null);
  /** A scroll to `selectedDate` passes other days on its way, which aren't the user's. */
  const silentUntil = useRef(0);
  const retry = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrolled = useRef(false);

  const targetKey = toDateKey(selectedDate ?? today);
  const hasRows = rows.length > 0;
  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new day from outside, or the first rows, scroll the list.
  useEffect(() => {
    const day = findAgendaDay(dayKeys, targetKey);
    if (!day || day === topKey.current) return;
    topKey.current = day;
    silentUntil.current = Date.now() + SCROLL_SETTLE_MS;
    listRef.current?.scrollToIndex({ index: indexByDay[day] ?? 0, animated: scrolled.current, viewPosition: 0 });
    scrolled.current = true;
  }, [targetKey, hasRows]);
  useEffect(() => () => clearTimeout(retry.current), []);

  // A row far down isn't laid out yet: jump near it by the average row height, then aim again once it is.
  const onScrollToIndexFailed = useCallback(({ index, averageItemLength }: { index: number; averageItemLength: number }) => {
    listRef.current?.scrollToOffset({ offset: index * averageItemLength, animated: false });
    clearTimeout(retry.current);
    retry.current = setTimeout(() => listRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0 }), SCROLL_RETRY_MS);
  }, []);

  const onViewable = (viewable: ListViewToken[]) => {
    const first = viewable.filter((token) => token.index != null).sort((a, b) => (a.index ?? 0) - (b.index ?? 0))[0];
    const row: AgendaRow<T> | undefined = first?.item;
    if (!row || row.dateKey === topKey.current) return;
    topKey.current = row.dateKey;
    if (Date.now() >= silentUntil.current) onVisibleDateChange?.(row.date);
  };
  // FlatList wants the same callback for its whole life, so it reads the latest one through a ref.
  const latestViewable = useRef(onViewable);
  latestViewable.current = onViewable;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ListViewToken[] }) =>
    latestViewable.current(viewableItems)
  ).current;

  const infoFor = useEventInfo<T>({ locale, hour12, labels, fill: design.eventFill, theme });

  return {
    theme,
    design,
    layout,
    labels,
    hour12,
    today,
    rows,
    headerIndices,
    listRef,
    onScrollToIndexFailed,
    onViewableItemsChanged,
    viewabilityConfig: VIEWABILITY,
    infoFor,
  };
};
