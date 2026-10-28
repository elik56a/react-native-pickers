import { I18nManager, View } from 'react-native';

import { CALENDAR_VIEW } from '../../calendar/calendar.constants';
import { CalendarHeader } from '../../calendar/components/CalendarHeader';
import { QuickGrid } from '../../calendar/components/QuickGrid';
import { useMonthGrid } from '../hooks/useMonthGrid';
import { MONTH_GRID_HEIGHT } from '../month.constants';
import type { MonthGridProps } from '../month.types';

/** Material's and the web's month picker: the months of a year to tap, under the year; tap the year for a grid of years. */
export const MonthGrid = (props: MonthGridProps) => {
  const { theme, style, styles: slots, testID } = props;
  const grid = useMonthGrid(props);
  return (
    <View style={[{ backgroundColor: theme.colors.background, paddingVertical: theme.spacing.sm }, style]} testID={testID}>
      <CalendarHeader
        label={grid.title}
        accessibilityLabel={grid.title}
        // The header's caret points down while the title opens a grid, as the calendar's day view does.
        view={grid.view === CALENDAR_VIEW.years ? CALENDAR_VIEW.years : CALENDAR_VIEW.days}
        enableQuickJump
        isArrowDisabled={grid.isArrowDisabled}
        onTitlePress={grid.toggleView}
        onArrowPress={grid.onArrowPress}
        rtl={!!I18nManager.isRTL}
        theme={theme}
        slots={slots}
      />
      <QuickGrid cells={grid.cells} height={MONTH_GRID_HEIGHT} onSelect={grid.select} theme={theme} slots={slots} />
    </View>
  );
};
