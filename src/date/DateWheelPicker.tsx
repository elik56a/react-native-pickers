import { useCallback, useMemo, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SlotStyles, ThemableProps } from '../types';
import { clampDate, daysInMonth, getMonthNames, isOutOfRange } from '../utils/date';
import type { MultiWheelSlot, WheelColumn } from '../wheel/MultiWheelPicker';
import { MultiWheelPicker } from '../wheel/MultiWheelPicker';

export type DatePart = 'day' | 'month' | 'year';

export interface DateWheelPickerProps extends ThemableProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  onValueChanging?: (date: Date) => void;
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  /** Column order. Default: from locale (e.g. M/D/Y for en-US, D/M/Y for he) */
  order?: DatePart[];
  /** 'long' (January), 'short' (Jan) or 'numeric' (01). Default: 'long' */
  monthFormat?: 'long' | 'short' | 'numeric';
  /** Years when no min/max is given. Default: ±100 from today */
  yearRange?: [number, number];
  /** Loop the day and month wheels. Default: true */
  loop?: boolean;
  itemHeight?: number;
  visibleItems?: number;
  variant?: '3d' | 'flat';
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<MultiWheelSlot>;
  testID?: string;
}

function localeOrder(locale?: string): DatePart[] {
  try {
    const parts = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(new Date(2021, 10, 23));
    const order = parts.map((p) => p.type).filter((t): t is DatePart => t === 'day' || t === 'month' || t === 'year');
    if (order.length === 3) return order;
  } catch {
    // fall through
  }
  return ['month', 'day', 'year'];
}

export function DateWheelPicker({
  value,
  defaultValue,
  onChange,
  onValueChanging,
  locale,
  minDate,
  maxDate,
  order,
  monthFormat = 'long',
  yearRange,
  loop = true,
  itemHeight,
  visibleItems,
  variant,
  style,
  styles,
  theme,
  testID,
}: DateWheelPickerProps) {
  const [inner, setInner] = useState<Date>(() => clampDate(value ?? defaultValue ?? new Date(), minDate, maxDate));
  const date = value ?? inner;
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const cols = order ?? localeOrder(locale);
  const now = new Date();
  const minY = minDate?.getFullYear() ?? yearRange?.[0] ?? now.getFullYear() - 100;
  const maxY = maxDate?.getFullYear() ?? yearRange?.[1] ?? now.getFullYear() + 100;

  const make = useCallback(
    (patch: { y?: number; m?: number; d?: number }) => {
      const ny = patch.y ?? y;
      const nm = patch.m ?? m;
      const nd = Math.min(patch.d ?? d, daysInMonth(ny, nm));
      const out = new Date(date);
      out.setFullYear(ny, nm, nd);
      return clampDate(out, minDate, maxDate);
    },
    [d, date, m, maxDate, minDate, y]
  );

  const commit = useCallback(
    (next: Date) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
    [onChange, value]
  );

  const columns = useMemo(() => {
    const monthNames = monthFormat === 'numeric' ? null : getMonthNames(locale, monthFormat);
    const handlers = (pick: (v: number) => Date) => ({
      onChange: (v: number) => commit(pick(v)),
      onValueChanging: onValueChanging ? (v: number) => onValueChanging(pick(v)) : undefined,
    });
    const all: Record<DatePart, WheelColumn<number>> = {
      day: {
        key: 'day',
        items: Array.from({ length: daysInMonth(y, m) }, (_, i) => ({
          value: i + 1,
          label: String(i + 1).padStart(monthFormat === 'numeric' ? 2 : 1, '0'),
          disabled: isOutOfRange(new Date(y, m, i + 1), minDate, maxDate),
        })),
        value: d,
        loop,
        flex: 0.8,
        ...handlers((v) => make({ d: v })),
      },
      month: {
        key: 'month',
        items: Array.from({ length: 12 }, (_, i) => ({
          value: i,
          label: monthNames ? monthNames[i]! : String(i + 1).padStart(2, '0'),
          disabled: isOutOfRange(new Date(y, i, daysInMonth(y, i)), minDate, null) || isOutOfRange(new Date(y, i, 1), null, maxDate),
        })),
        value: m,
        loop,
        flex: monthFormat === 'long' ? 1.6 : 1,
        ...handlers((v) => make({ m: v })),
      },
      year: {
        key: 'year',
        items: Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i),
        value: y,
        flex: 1,
        ...handlers((v) => make({ y: v })),
      },
    };
    return cols.map((c) => all[c]);
  }, [cols, commit, d, locale, loop, m, make, maxDate, maxY, minDate, minY, monthFormat, onValueChanging, y]);

  return (
    <MultiWheelPicker
      columns={columns}
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
