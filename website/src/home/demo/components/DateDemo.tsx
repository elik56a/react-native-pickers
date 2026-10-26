import { useMemo, useState } from 'react';

import type { DateRange } from '@elik56a/react-native-pickers';
import { DatePicker } from '@elik56a/react-native-pickers';
import type { TabOptions } from '../../playground/playground.types';
import { buildPrices, daysFromNow, startOfToday, stay } from '../demo.utils';

const DAY_HEIGHT = 48;

export const DateDemo = ({ options }: { options: TabOptions<'date'> }) => {
  const prices = useMemo(buildPrices, []);
  const [date, setDate] = useState<Date | null>(() => daysFromNow(2));
  const [range, setRange] = useState<DateRange>(() => stay(1, 4));
  const [dates, setDates] = useState<Date[]>(() => [daysFromNow(2), daysFromNow(5), daysFromNow(9)]);
  const [ranges, setRanges] = useState<DateRange[]>(() => [stay(1, 3), stay(8, 11)]);
  const common = {
    minDate: startOfToday(),
    dayHeight: DAY_HEIGHT,
    markedDates: options.prices ? prices : undefined,
    firstDayOfWeek: options.firstDayOfWeek,
  };
  if (options.mode === 'single') return <DatePicker {...common} value={date} onChange={setDate} />;
  if (options.mode === 'multiple') return <DatePicker {...common} mode="multiple" value={dates} onChange={setDates} />;
  if (options.mode === 'ranges') return <DatePicker {...common} mode="ranges" value={ranges} onChange={setRanges} />;
  return <DatePicker {...common} mode="range" value={range} onChange={setRange} />;
};
