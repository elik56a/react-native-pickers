import { FlatList, View } from 'react-native';

import { PickerText } from '../core/components/PickerText';
import { SHOWS_SCROLL_INDICATOR } from '../core/core.constants';
import { isSameDay } from '../core/utils/date.utils';
import { AgendaItem } from './components/AgendaItem';
import { useAgenda } from './hooks/useAgenda';
import { styles } from './schedule.styles';
import type { AgendaProps, AgendaRow, ScheduleEvent } from './schedule.types';

const keyOf = (row: AgendaRow) => row.key;

/**
 * Events as a list, day by day: iOS Calendar's list with a band per day that sticks to the top, or Google Calendar's
 * schedule with the date beside each day's events. Scrolls to `selectedDate`, and tells you the day at the top as you
 * scroll, to keep a calendar above it in step.
 */
export const Agenda = <T extends ScheduleEvent>(props: AgendaProps<T>) => {
  const {
    locale,
    onEventPress,
    onEventLongPress,
    renderEvent,
    renderDayHeader,
    onEndReached,
    onRefresh,
    refreshing,
    ListHeaderComponent,
    ListFooterComponent,
    style,
    styles: slots,
    testID,
  } = props;
  const a = useAgenda(props);
  const { theme } = a;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style, slots?.container]} testID={testID}>
      <FlatList
        ref={a.listRef}
        data={a.rows}
        keyExtractor={keyOf}
        renderItem={({ item }) => (
          <AgendaItem
            row={item}
            today={isSameDay(item.date, a.today)}
            layout={a.layout}
            locale={locale}
            hour12={a.hour12}
            labels={a.labels}
            infoFor={a.infoFor}
            renderEvent={renderEvent}
            renderDayHeader={renderDayHeader}
            onEventPress={onEventPress}
            onEventLongPress={onEventLongPress}
            theme={theme}
            slots={slots}
          />
        )}
        stickyHeaderIndices={a.headerIndices}
        onScrollToIndexFailed={a.onScrollToIndexFailed}
        onViewableItemsChanged={a.onViewableItemsChanged}
        viewabilityConfig={a.viewabilityConfig}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing ?? false}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={
          <View style={styles.listEmpty}>
            <PickerText theme={theme} color="textSecondary" style={slots?.emptyText}>
              {a.labels.noEvents}
            </PickerText>
          </View>
        }
        showsVerticalScrollIndicator={SHOWS_SCROLL_INDICATOR}
      />
    </View>
  );
};
