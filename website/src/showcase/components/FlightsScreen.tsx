import { useState } from 'react';
import { View } from 'react-native';

import type { DateRange } from '@elik56a/react-native-pickers';
import { DatePickerField, HorizontalList, SelectPicker, WheelPickerField } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { CITIES } from '../../home/demo/demo.constants';
import { styles } from '../../home/demo/demo.styles';
import { daysFromNow, deviceSheetProps, startOfToday, stay } from '../../home/demo/demo.utils';
import { useFlagOptions } from '../../home/demo/hooks/useFlagOptions';
import { CABINS, FLIGHTS, TRAVELERS, TRIP_TYPE, TRIP_TYPES } from '../showcase.constants';
import type { ScreenProps, TripType } from '../showcase.types';

export const FlightsScreen = ({ platform, screenHeight }: ScreenProps) => {
  const sheetProps = deviceSheetProps(platform, screenHeight);
  const cities = useFlagOptions(CITIES);
  const [trip, setTrip] = useState<TripType>(TRIP_TYPE.round);
  const [from, setFrom] = useState<string | null>(FLIGHTS.from);
  const [to, setTo] = useState<string | null>(FLIGHTS.to);
  const [range, setRange] = useState<DateRange>(() => stay(FLIGHTS.stay.from, FLIGHTS.stay.to));
  const [day, setDay] = useState<Date | null>(() => daysFromNow(FLIGHTS.day));
  const [travelers, setTravelers] = useState(FLIGHTS.travelers);
  const [cabin, setCabin] = useState(FLIGHTS.cabin);
  return (
    <AppScreen
      platform={platform}
      title="Find flights"
      subtitle={`${from ?? '?'} → ${to ?? '?'}`}
      action={<ActionButton label="Search flights" busyLabel="Searching…" doneLabel="✓ 24 flights found" />}
    >
      <HorizontalList items={TRIP_TYPES} value={trip} onChange={setTrip} />
      <View style={styles.pair}>
        <View style={styles.half}>
          <SelectPicker label="From" options={cities} value={from} onChange={setFrom} searchable sheet={{ sheetProps }} />
        </View>
        <View style={styles.half}>
          <SelectPicker label="To" options={cities} value={to} onChange={setTo} searchable sheet={{ sheetProps }} />
        </View>
      </View>
      {trip === TRIP_TYPE.round ? (
        <DatePickerField label="Dates" mode="range" value={range} onConfirm={setRange} minDate={startOfToday()} sheetProps={sheetProps} />
      ) : (
        <DatePickerField label="Date" value={day} onConfirm={setDay} minDate={startOfToday()} sheetProps={sheetProps} />
      )}
      <WheelPickerField label="Travelers" items={TRAVELERS} value={travelers} onConfirm={setTravelers} sheetProps={sheetProps} />
      <HorizontalList variant="chips" items={CABINS} value={cabin} onChange={setCabin} />
    </AppScreen>
  );
};
