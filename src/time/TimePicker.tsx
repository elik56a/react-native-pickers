import type React from 'react';
import { useCallback, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SlotStyles, ThemableProps } from '../core';
import { useControllableState } from '../core/hooks/useControllableState';
import { getDayPeriods, uses12HourClock } from '../core/utils/date.utils';
import type { MultiWheelSlot, WheelColumn, WheelItem } from '../wheel';
import { MultiWheelPicker } from '../wheel';

export interface TimePickerProps extends ThemableProps {
  /** Selected time (the date part is preserved). */
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  /** Fires on every tick while scrolling (for haptics). */
  onValueChanging?: (date: Date) => void;
  /** Default: 'auto' (from locale) */
  format?: '12h' | '24h' | 'auto';
  locale?: string;
  /** Minute step: 1, 5, 15... Default: 1 */
  minuteInterval?: number;
  showSeconds?: boolean;
  secondInterval?: number;
  /** Earliest selectable time of day */
  minTime?: Date;
  /** Latest selectable time of day */
  maxTime?: Date;
  /** Infinite hour/minute wheels. Default: true */
  loop?: boolean;
  /** Zero-pad hours. Default: true for 24h, false for 12h */
  padHours?: boolean;
  /** Labels for AM/PM. Default: from locale */
  dayPeriodLabels?: [string, string];
  /** Put AM/PM before the hours (e.g. zh, ko). Default: false */
  dayPeriodFirst?: boolean;
  /** Separator between columns. Default: ':' */
  separator?: React.ReactNode;
  itemHeight?: number;
  visibleItems?: number;
  variant?: '3d' | 'flat';
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<MultiWheelSlot>;
  testID?: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const range = (count: number, step = 1) => Array.from({ length: Math.ceil(count / step) }, (_, i) => i * step);
const secondsOfDay = (d: Date) => d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();

export function TimePicker({
  value,
  defaultValue,
  onChange,
  onValueChanging,
  format = 'auto',
  locale,
  minuteInterval = 1,
  showSeconds = false,
  secondInterval = 1,
  minTime,
  maxTime,
  loop = true,
  padHours,
  dayPeriodLabels,
  dayPeriodFirst = false,
  separator = ':',
  itemHeight,
  visibleItems,
  variant,
  style,
  styles,
  theme,
  testID,
}: TimePickerProps) {
  const [date, setDate] = useControllableState(value, () => defaultValue ?? new Date(), onChange);
  const is12 = format === 'auto' ? uses12HourClock(locale) : format === '12h';
  const periods = useMemo(() => dayPeriodLabels ?? getDayPeriods(locale), [dayPeriodLabels, locale]);
  const padH = padHours ?? !is12;

  const h24 = date.getHours();
  const minute = Math.floor(date.getMinutes() / minuteInterval) * minuteInterval;
  const second = Math.floor(date.getSeconds() / secondInterval) * secondInterval;
  const isPM = h24 >= 12;

  const minS = minTime ? secondsOfDay(minTime) : 0;
  const maxS = maxTime ? secondsOfDay(maxTime) : 86399;

  const build = useCallback(
    (patch: { h24?: number; m?: number; s?: number }) => {
      const d = new Date(date);
      d.setHours(patch.h24 ?? h24, patch.m ?? minute, showSeconds ? (patch.s ?? second) : 0, 0);
      return d;
    },
    [date, h24, minute, second, showSeconds]
  );

  const commit = useCallback(
    (d: Date) => {
      // Clamp to [minTime, maxTime]
      const sec = secondsOfDay(d);
      if (sec < minS || sec > maxS) {
        const target = sec < minS ? minS : maxS;
        d = new Date(d);
        d.setHours(Math.floor(target / 3600), Math.floor((target % 3600) / 60), showSeconds ? target % 60 : 0, 0);
      }
      setDate(d);
    },
    [maxS, minS, setDate, showSeconds]
  );

  const columns = useMemo(() => {
    const cols: WheelColumn[] = [];
    const hourOutOfRange = (h: number) => h * 3600 + 3599 < minS || h * 3600 > maxS;
    const hourItems: WheelItem<number>[] = is12
      ? range(12).map((i) => {
          const display = i === 0 ? 12 : i;
          const real = (isPM ? 12 : 0) + i;
          return {
            value: i,
            label: padH ? pad2(display) : String(display),
            disabled: hourOutOfRange(real),
          };
        })
      : range(24).map((h) => ({
          value: h,
          label: padH ? pad2(h) : String(h),
          disabled: hourOutOfRange(h),
        }));

    const minuteItems: WheelItem<number>[] = range(60, minuteInterval).map((m) => {
      const t = h24 * 3600 + m * 60;
      return {
        value: m,
        label: pad2(m),
        disabled: t + 59 < minS || t > maxS,
      };
    });

    const toH24 = (hv: number, pm: boolean) => (is12 ? (pm ? 12 : 0) + hv : hv);
    const mk = (pick: (v: number) => Date) => ({
      onChange: (v: number) => commit(pick(v)),
      onValueChanging: onValueChanging ? (v: number) => onValueChanging(pick(v)) : undefined,
    });

    const periodCol: WheelColumn<number> = {
      key: 'period',
      items: [
        { value: 0, label: periods[0], disabled: minS >= 12 * 3600 },
        { value: 1, label: periods[1], disabled: maxS < 12 * 3600 },
      ],
      value: isPM ? 1 : 0,
      flex: 1,
      ...mk((v) => build({ h24: (h24 % 12) + (v ? 12 : 0) })),
    };

    if (is12 && dayPeriodFirst) cols.push(periodCol);
    cols.push({
      key: 'hour',
      items: hourItems,
      value: is12 ? h24 % 12 : h24,
      loop,
      flex: 1,
      ...mk((v) => build({ h24: toH24(v, isPM) })),
    });
    cols.push({
      key: 'minute',
      items: minuteItems,
      value: minute,
      loop,
      flex: 1,
      ...mk((v) => build({ m: v })),
    });
    if (showSeconds) {
      cols.push({
        key: 'second',
        items: range(60, secondInterval).map((sv) => ({
          value: sv,
          label: pad2(sv),
        })),
        value: second,
        loop,
        flex: 1,
        ...mk((v) => build({ s: v })),
      });
    }
    if (is12 && !dayPeriodFirst) cols.push(periodCol);
    return cols;
  }, [
    build,
    commit,
    dayPeriodFirst,
    h24,
    is12,
    isPM,
    loop,
    maxS,
    minS,
    minute,
    minuteInterval,
    onValueChanging,
    padH,
    periods,
    second,
    secondInterval,
    showSeconds,
  ]);

  const sep = useCallback(
    (left: number) => {
      const leftKey = columns[left]?.key;
      const rightKey = columns[left + 1]?.key;
      return leftKey === 'period' || rightKey === 'period' ? null : separator;
    },
    [columns, separator]
  );

  return (
    <MultiWheelPicker
      columns={columns}
      separator={sep}
      itemHeight={itemHeight}
      visibleItems={visibleItems}
      variant={variant}
      style={style}
      styles={styles}
      theme={theme}
      testID={testID}
    />
  );
}
