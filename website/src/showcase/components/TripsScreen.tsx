import { useState } from 'react';

import type { DateRange } from '@elik56a/react-native-pickers';
import { DatePicker, SelectPicker } from '@elik56a/react-native-pickers';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { CITIES } from '../../home/demo/demo.constants';
import { bookedNights, deviceSheetProps, plural, startOfToday, stay } from '../../home/demo/demo.utils';
import { useFlagOptions } from '../../home/demo/hooks/useFlagOptions';
import { CALENDAR_DAY_HEIGHT, TRIPS } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';

export const TripsScreen = ({ platform, screenHeight }: ScreenProps) => {
  const options = useFlagOptions(CITIES);
  const [ranges, setRanges] = useState<DateRange[]>(() => TRIPS.stays.map(([from, to]) => stay(from, to)));
  const [cities, setCities] = useState(TRIPS.cities);
  return (
    <AppScreen
      platform={platform}
      title="Trips"
      subtitle={`${plural(ranges.length, 'trip')} · ${plural(bookedNights(ranges).length, 'night')}`}
    >
      <DatePicker mode="ranges" value={ranges} onChange={setRanges} minDate={startOfToday()} dayHeight={CALENDAR_DAY_HEIGHT} />
      <SelectPicker
        label="Cities"
        options={options}
        multiple
        value={cities}
        onChange={setCities}
        searchable
        sheet={{ sheetProps: deviceSheetProps(platform, screenHeight) }}
      />
    </AppScreen>
  );
};
