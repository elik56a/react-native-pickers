import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Animated, I18nManager, PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PickerTheme } from '../theme';
import { textStyle, usePickerTheme } from '../theme';
import type { SlotStyles, ThemableProps } from '../types';
import {
  addMonths,
  buildMonthGrid,
  compareDay,
  formatDate,
  formatMonthYear,
  getFirstDayOfWeek,
  getMonthNames,
  getWeekdayNames,
  isBetweenDays,
  isOutOfRange,
  isSameDay,
  startOfMonth,
  toDateKey,
} from '../utils/date';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface MarkedDate {
  /** Dot colors under the day number */
  dots?: string[];
  disabled?: boolean;
  /** Small text under the day (e.g. a price) */
  label?: string;
  textColor?: string;
}

export type CalendarSlot =
  | 'container'
  | 'header'
  | 'headerTitle'
  | 'arrow'
  | 'arrowText'
  | 'weekdays'
  | 'weekdayText'
  | 'week'
  | 'day'
  | 'dayInner'
  | 'dayText'
  | 'selectedDay'
  | 'selectedDayText'
  | 'todayDay'
  | 'todayDayText'
  | 'disabledDayText'
  | 'outsideDayText'
  | 'rangeBand'
  | 'dot'
  | 'dayLabel'
  | 'gridCell'
  | 'gridCellText';

export interface DayState {
  date: Date;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
  today: boolean;
  disabled: boolean;
  outside: boolean;
  marking?: MarkedDate;
}

export interface CalendarBaseProps extends ThemableProps {
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  /** Return true to disable a day */
  isDateDisabled?: (date: Date) => boolean;
  /** 0 = Sunday ... 6 = Saturday. Default: from locale, else 0 */
  firstDayOfWeek?: number;
  /** Keyed by `YYYY-MM-DD` */
  markedDates?: Record<string, MarkedDate>;
  /** Month shown initially. Default: the selected date or today */
  initialMonth?: Date;
  onMonthChange?: (month: Date) => void;
  showOutsideDays?: boolean;
  /** Always render 6 weeks to keep the height stable. Default: true */
  fixedWeeks?: boolean;
  /** Swipe left/right to change months. Default: true */
  enableSwipe?: boolean;
  /** Tap the title to jump by month / year. Default: true */
  enableQuickJump?: boolean;
  weekdayFormat?: 'short' | 'narrow';
  showWeekdays?: boolean;
  /** Override the title text */
  formatTitle?: (month: Date, locale?: string) => string;
  /** Fully custom day cell */
  renderDay?: (state: DayState, theme: PickerTheme) => React.ReactNode;
  /** Custom arrows */
  renderArrow?: (direction: 'prev' | 'next', disabled: boolean) => React.ReactNode;
  /** Range of years in the year grid. Default: minDate/maxDate or ±100 years */
  yearRange?: [number, number];
  /** Day cell height. Default: 44 */
  dayHeight?: number;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<CalendarSlot>;
  testID?: string;
}

export type CalendarSelectionProps =
  | { mode?: 'single'; value?: Date | null; defaultValue?: Date | null; onChange?: (date: Date) => void }
  | {
      mode: 'range';
      value?: DateRange;
      defaultValue?: DateRange;
      onChange?: (range: DateRange) => void;
      /** Minimum nights in a range (end - start, in days) */
      minRangeDays?: number;
      maxRangeDays?: number;
      /** Allow start === end. Default: true */
      allowSingleDayRange?: boolean;
    }
  | { mode: 'multiple'; value?: Date[]; defaultValue?: Date[]; onChange?: (dates: Date[]) => void; maxSelections?: number };

export type CalendarProps = CalendarBaseProps & CalendarSelectionProps;

type View3 = 'days' | 'months' | 'years';
const NEXT_VIEW: Record<View3, View3> = { days: 'months', months: 'years', years: 'days' };
const DAY_MS = 86400000;

export function Calendar(props: CalendarProps) {
  const {
    locale,
    minDate,
    maxDate,
    isDateDisabled,
    markedDates,
    initialMonth,
    onMonthChange,
    showOutsideDays = true,
    fixedWeeks = true,
    enableSwipe = true,
    enableQuickJump = true,
    weekdayFormat = 'short',
    showWeekdays = true,
    formatTitle,
    renderDay,
    renderArrow,
    yearRange,
    dayHeight = 44,
    style,
    styles: slots,
    theme: themeOverride,
    testID,
  } = props;
  const theme = usePickerTheme(themeOverride);
  const mode = props.mode ?? 'single';
  const firstDay = props.firstDayOfWeek ?? getFirstDayOfWeek(locale);
  const rtl = !!I18nManager.isRTL;

  // ----- selection state (controlled or uncontrolled) -----
  const [innerSingle, setInnerSingle] = useState<Date | null>(mode === 'single' ? ((props as any).defaultValue ?? null) : null);
  const [innerRange, setInnerRange] = useState<DateRange>(
    mode === 'range' ? ((props as any).defaultValue ?? { start: null, end: null }) : { start: null, end: null }
  );
  const [innerMulti, setInnerMulti] = useState<Date[]>(mode === 'multiple' ? ((props as any).defaultValue ?? []) : []);
  const single: Date | null = mode === 'single' ? (props.value !== undefined ? (props.value as Date | null) : innerSingle) : null;
  const range: DateRange = mode === 'range' ? ((props.value as DateRange | undefined) ?? innerRange) : { start: null, end: null };
  const multi: Date[] = mode === 'multiple' ? ((props.value as Date[] | undefined) ?? innerMulti) : [];

  const anchor = initialMonth ?? single ?? range.start ?? multi[0] ?? new Date();
  const [month, setMonth] = useState(() => startOfMonth(anchor));
  const [view, setView] = useState<View3>('days');
  const today = useMemo(() => new Date(), []);

  // Follow external value changes in single mode
  const singleKey = single ? toDateKey(single) : '';
  useEffect(() => {
    if (single && view === 'days' && (single.getMonth() !== month.getMonth() || single.getFullYear() !== month.getFullYear())) {
      setMonth(startOfMonth(single));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleKey]);

  const isDisabled = useCallback(
    (d: Date) => isOutOfRange(d, minDate, maxDate) || !!isDateDisabled?.(d) || !!markedDates?.[toDateKey(d)]?.disabled,
    [isDateDisabled, markedDates, maxDate, minDate]
  );

  // ----- month navigation with slide animation -----
  const slide = useRef(new Animated.Value(0)).current;
  const native = Platform.OS !== 'web';
  const canPrev = !minDate || compareDay(addMonths(month, -1), startOfMonth(minDate)) >= 0;
  const canNext = !maxDate || compareDay(addMonths(month, 1), startOfMonth(maxDate)) <= 0;

  const goMonth = useCallback(
    (delta: number) => {
      if ((delta < 0 && !canPrev) || (delta > 0 && !canNext)) return;
      const next = addMonths(month, delta);
      setMonth(next);
      onMonthChange?.(next);
      slide.setValue(delta * (rtl ? -1 : 1));
      Animated.timing(slide, { toValue: 0, duration: theme.animation.duration, useNativeDriver: native }).start();
    },
    [canNext, canPrev, month, native, onMonthChange, rtl, slide, theme.animation.duration]
  );
  const goRef = useRef(goMonth);
  goRef.current = goMonth;

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 14 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 50 || Math.abs(g.vx) > 0.5) {
          const dir = g.dx < 0 ? 1 : -1;
          goRef.current(I18nManager.isRTL === true ? -dir : dir);
        }
      },
    })
  ).current;

  // ----- selection logic -----
  const select = useCallback(
    (d: Date) => {
      if (mode === 'single') {
        if (props.value === undefined) setInnerSingle(d);
        (props.onChange as ((d: Date) => void) | undefined)?.(d);
      } else if (mode === 'range') {
        const p = props as Extract<CalendarProps, { mode: 'range' }>;
        let next: DateRange;
        if (!range.start || range.end || compareDay(d, range.start) < 0) {
          next = { start: d, end: null };
        } else {
          const days = Math.round((d.getTime() - range.start.getTime()) / DAY_MS);
          if (days === 0 && p.allowSingleDayRange === false) return;
          if (p.minRangeDays !== undefined && days < p.minRangeDays) return;
          if (p.maxRangeDays !== undefined && days > p.maxRangeDays) next = { start: d, end: null };
          else {
            // Reject ranges that cross disabled days
            let crosses = false;
            for (let t = new Date(range.start); compareDay(t, d) < 0; t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1)) {
              if (isDisabled(t)) {
                crosses = true;
                break;
              }
            }
            next = crosses ? { start: d, end: null } : { start: range.start, end: d };
          }
        }
        if (p.value === undefined) setInnerRange(next);
        p.onChange?.(next);
      } else {
        const p = props as Extract<CalendarProps, { mode: 'multiple' }>;
        const exists = multi.some((x) => isSameDay(x, d));
        if (!exists && p.maxSelections !== undefined && multi.length >= p.maxSelections) return;
        const next = exists ? multi.filter((x) => !isSameDay(x, d)) : [...multi, d].sort((a, b) => a.getTime() - b.getTime());
        if (p.value === undefined) setInnerMulti(next);
        p.onChange?.(next);
      }
    },
    [isDisabled, mode, multi, props, range.end, range.start]
  );

  const grid = useMemo(() => buildMonthGrid(month.getFullYear(), month.getMonth(), firstDay, fixedWeeks), [firstDay, fixedWeeks, month]);
  const weekdayNames = useMemo(() => {
    const names = getWeekdayNames(locale, weekdayFormat);
    return Array.from({ length: 7 }, (_, i) => names[(firstDay + i) % 7]!);
  }, [firstDay, locale, weekdayFormat]);

  const title = formatTitle ? formatTitle(month, locale) : formatMonthYear(month, locale);
  const accent = theme.colors.primary;

  const header = (
    <View style={[s.header, { paddingHorizontal: theme.spacing.sm, marginBottom: theme.spacing.sm }, slots?.header]}>
      <Pressable
        onPress={enableQuickJump ? () => setView(NEXT_VIEW[view]) : undefined}
        style={({ pressed }) => [s.titleBtn, { borderRadius: theme.radius.sm, opacity: pressed ? 0.6 : 1 }]}
        accessibilityRole={enableQuickJump ? 'button' : 'header'}
        accessibilityLabel={title}
      >
        <Text style={[textStyle(theme, 'md', 'bold'), slots?.headerTitle]}>
          {view === 'years' ? yearPageLabel(month.getFullYear()) : view === 'months' ? String(month.getFullYear()) : title}
        </Text>
        {enableQuickJump && (
          <Text style={[textStyle(theme, 'sm', 'bold'), { color: accent, marginStart: 6 }]}>{view === 'days' ? '▾' : '▴'}</Text>
        )}
      </Pressable>
      <View style={s.arrows}>
        {(['prev', 'next'] as const).map((dir) => {
          const disabled = view === 'days' ? (dir === 'prev' ? !canPrev : !canNext) : false;
          const onPress = () => {
            const delta = dir === 'prev' ? -1 : 1;
            if (view === 'days') goMonth(delta);
            else if (view === 'months') setMonth(new Date(month.getFullYear() + delta, month.getMonth(), 1));
            else setMonth(new Date(month.getFullYear() + delta * 12, month.getMonth(), 1));
          };
          return (
            <Pressable
              key={dir}
              onPress={disabled ? undefined : onPress}
              hitSlop={8}
              style={({ pressed }) => [
                s.arrow,
                { borderRadius: theme.radius.full, backgroundColor: pressed ? theme.colors.surface : 'transparent' },
                slots?.arrow,
              ]}
              accessibilityRole="button"
              accessibilityLabel={dir === 'prev' ? 'Previous' : 'Next'}
              accessibilityState={{ disabled }}
            >
              {renderArrow ? (
                renderArrow(dir, disabled)
              ) : (
                <Text
                  style={[
                    textStyle(theme, 'lg', 'bold'),
                    { color: disabled ? theme.colors.textDisabled : accent, lineHeight: 22 },
                    slots?.arrowText,
                  ]}
                >
                  {(dir === 'prev') !== rtl ? '‹' : '›'}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const translateX = slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [-40, 0, 40] });
  const opacity = slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] });

  let body: React.ReactNode;
  if (view === 'months') {
    const names = getMonthNames(locale, 'short');
    body = (
      <QuickGrid
        theme={theme}
        slots={slots}
        cells={names.map((label, m) => {
          const d = new Date(month.getFullYear(), m, 1);
          const disabled =
            (!!minDate && compareDay(new Date(month.getFullYear(), m + 1, 0), minDate) < 0) || (!!maxDate && compareDay(d, maxDate) > 0);
          return {
            key: String(m),
            label,
            selected: m === month.getMonth(),
            disabled,
            onPress: () => {
              setMonth(d);
              onMonthChange?.(d);
              setView('days');
            },
          };
        })}
        height={dayHeight * (fixedWeeks ? 6 : 5) + (showWeekdays ? 28 : 0)}
      />
    );
  } else if (view === 'years') {
    const y0 = Math.floor(month.getFullYear() / 12) * 12;
    const [minY, maxY] = yearRange ?? [
      minDate?.getFullYear() ?? today.getFullYear() - 100,
      maxDate?.getFullYear() ?? today.getFullYear() + 100,
    ];
    body = (
      <QuickGrid
        theme={theme}
        slots={slots}
        cells={Array.from({ length: 12 }, (_, i) => {
          const y = y0 + i;
          return {
            key: String(y),
            label: String(y),
            selected: y === month.getFullYear(),
            disabled: y < minY || y > maxY,
            onPress: () => {
              setMonth(new Date(y, month.getMonth(), 1));
              setView('months');
            },
          };
        })}
        height={dayHeight * (fixedWeeks ? 6 : 5) + (showWeekdays ? 28 : 0)}
      />
    );
  } else {
    body = (
      <Animated.View style={{ transform: [{ translateX }], opacity }} {...(enableSwipe ? pan.panHandlers : {})}>
        {showWeekdays && (
          <View style={[s.week, { marginBottom: 4 }, slots?.weekdays]}>
            {weekdayNames.map((w, i) => (
              <View key={i} style={s.cell}>
                <Text
                  style={[textStyle(theme, 'xs', 'medium'), { color: theme.colors.textSecondary, textAlign: 'center' }, slots?.weekdayText]}
                >
                  {w}
                </Text>
              </View>
            ))}
          </View>
        )}
        {grid.map((week, wi) => (
          <View key={wi} style={[s.week, slots?.week]}>
            {week.map((d) => {
              const outside = d.getMonth() !== month.getMonth();
              const rangeStart = mode === 'range' && isSameDay(d, range.start);
              const rangeEnd = mode === 'range' && isSameDay(d, range.end);
              const state: DayState = {
                date: d,
                outside,
                today: isSameDay(d, today),
                disabled: isDisabled(d),
                rangeStart,
                rangeEnd,
                inRange: mode === 'range' && isBetweenDays(d, range.start, range.end),
                selected:
                  mode === 'single' ? isSameDay(d, single) : mode === 'range' ? rangeStart || rangeEnd : multi.some((x) => isSameDay(x, d)),
                marking: markedDates?.[toDateKey(d)],
              };
              return (
                <DayCell
                  key={d.getTime()}
                  state={state}
                  hidden={outside && !showOutsideDays}
                  hasRangeEnd={!!range.end}
                  theme={theme}
                  slots={slots}
                  height={dayHeight}
                  locale={locale}
                  renderDay={renderDay}
                  onPress={select}
                />
              );
            })}
          </View>
        ))}
      </Animated.View>
    );
  }

  return (
    <View
      style={[{ backgroundColor: theme.colors.background, paddingVertical: theme.spacing.sm }, style, slots?.container]}
      testID={testID}
    >
      {header}
      {body}
    </View>
  );
}

function yearPageLabel(year: number) {
  const y0 = Math.floor(year / 12) * 12;
  return `${y0} – ${y0 + 11}`;
}

interface DayCellProps {
  state: DayState;
  hidden: boolean;
  hasRangeEnd: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
  height: number;
  locale?: string;
  renderDay?: (state: DayState, theme: PickerTheme) => React.ReactNode;
  onPress: (d: Date) => void;
}

const DayCell = memo(function DayCell({ state, hidden, hasRangeEnd, theme, slots, height, locale, renderDay, onPress }: DayCellProps) {
  const { date, selected, disabled, outside, today, inRange, rangeStart, rangeEnd, marking } = state;
  if (hidden) return <View style={[s.cell, { height }]} />;
  const c = theme.colors;
  const size = Math.min(height - 4, 40);
  const band = inRange || (hasRangeEnd && (rangeStart || rangeEnd) && !(rangeStart && rangeEnd));
  const textColor = selected
    ? c.onPrimary
    : disabled
      ? c.textDisabled
      : (marking?.textColor ?? (outside ? c.textDisabled : today ? c.primary : c.text));

  return (
    <Pressable
      onPress={disabled ? undefined : () => onPress(date)}
      style={[s.cell, { height }, slots?.day]}
      accessibilityRole="button"
      accessibilityLabel={formatDate(date, locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      accessibilityState={{ selected, disabled }}
    >
      {({ pressed }) => (
        <>
          {band && (
            <View
              style={[
                s.band,
                { top: (height - size) / 2, height: size, backgroundColor: c.primaryMuted },
                rangeStart ? { start: '50%' } : rangeEnd ? { end: '50%' } : null,
                slots?.rangeBand,
              ]}
            />
          )}
          {renderDay ? (
            renderDay(state, theme)
          ) : (
            <View
              style={[
                s.dayInner,
                { width: size, height: size, borderRadius: size / 2 },
                selected && { backgroundColor: c.primary },
                !selected && pressed && !disabled && { backgroundColor: c.surface },
                !selected && today && { borderWidth: 1.5, borderColor: c.primary },
                slots?.dayInner,
                today && slots?.todayDay,
                selected && slots?.selectedDay,
              ]}
            >
              <Text
                style={[
                  textStyle(theme, 'md', selected || today ? 'bold' : 'regular'),
                  { color: textColor, textDecorationLine: disabled && !outside ? 'line-through' : 'none' },
                  slots?.dayText,
                  outside && slots?.outsideDayText,
                  disabled && slots?.disabledDayText,
                  today && slots?.todayDayText,
                  selected && slots?.selectedDayText,
                ]}
              >
                {date.getDate()}
              </Text>
              {marking?.label ? (
                <Text
                  style={[{ fontSize: 9, color: selected ? c.onPrimary : c.textSecondary, marginTop: -2 }, slots?.dayLabel]}
                  numberOfLines={1}
                >
                  {marking.label}
                </Text>
              ) : null}
              {marking?.dots?.length ? (
                <View style={s.dots}>
                  {marking.dots.slice(0, 3).map((color, i) => (
                    <View key={i} style={[s.dot, { backgroundColor: selected ? c.onPrimary : color }, slots?.dot]} />
                  ))}
                </View>
              ) : null}
            </View>
          )}
        </>
      )}
    </Pressable>
  );
});

interface QuickCell {
  key: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}

function QuickGrid({
  cells,
  theme,
  slots,
  height,
}: {
  cells: QuickCell[];
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
  height: number;
}) {
  const rows = [cells.slice(0, 3), cells.slice(3, 6), cells.slice(6, 9), cells.slice(9, 12)];
  return (
    <View style={{ height, justifyContent: 'space-evenly', paddingHorizontal: theme.spacing.sm }}>
      {rows.map((row, i) => (
        <View key={i} style={s.week}>
          {row.map((c) => (
            <Pressable
              key={c.key}
              onPress={c.disabled ? undefined : c.onPress}
              style={({ pressed }) => [
                s.quick,
                {
                  borderRadius: theme.radius.full,
                  backgroundColor: c.selected ? theme.colors.primary : pressed ? theme.colors.surface : 'transparent',
                },
                slots?.gridCell,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: c.selected, disabled: c.disabled }}
            >
              <Text
                style={[
                  textStyle(theme, 'md', c.selected ? 'bold' : 'regular'),
                  { color: c.selected ? theme.colors.onPrimary : c.disabled ? theme.colors.textDisabled : theme.colors.text },
                  slots?.gridCellText,
                ]}
              >
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8 },
  arrows: { flexDirection: 'row', gap: 4 },
  arrow: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  week: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dayInner: { alignItems: 'center', justifyContent: 'center' },
  band: { position: 'absolute', start: 0, end: 0 },
  dots: { flexDirection: 'row', gap: 2, position: 'absolute', bottom: 4 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  quick: { flex: 1, marginHorizontal: 6, height: 44, alignItems: 'center', justifyContent: 'center' },
});
