import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { DatePicker, PickersProvider, toDateKey } from '../src';
import type { DateRange } from '../src';

export default function DateDemo() {
  const [d, setD] = useState<Date>(new Date(2026, 9, 14));
  const [r, setR] = useState<DateRange>({ start: new Date(2026, 9, 20), end: new Date(2026, 9, 26) });
  const [w, setW] = useState(new Date(1990, 4, 17));
  return (
    <ScrollView contentContainerStyle={{ padding: 12, gap: 16 }}>
      <Text testID="single">single: {toDateKey(d)}</Text>
      <DatePicker value={d} onChange={setD} minDate={new Date(2026, 9, 5)} markedDates={{ '2026-10-22': { dots: ['#22C55E', '#F59E0B'] }, '2026-10-30': { label: '$89' } }} />
      <Text>range: {r.start && toDateKey(r.start)} → {r.end && toDateKey(r.end)}</Text>
      <PickersProvider colorScheme="dark">
        <DatePicker mode="range" value={r} onChange={setR} locale="he-IL" isDateDisabled={(x) => x.getDay() === 6} />
      </PickersProvider>
      <Text>wheel: {toDateKey(w)}</Text>
      <DatePicker display="wheel" value={w} onChange={setW} locale="en-GB" />
    </ScrollView>
  );
}
