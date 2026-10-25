import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import {
  DatePicker,
  DatePickerSheet,
  EmojiPicker,
  EmojiPickerSheet,
  PickersProvider,
  SelectPicker,
  TimePicker,
  TimePickerSheet,
  WheelPicker,
  formatDate,
} from '../src';
import type { DateRange } from '../src';

function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.7 : 1 }]}>
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const dark = useColorScheme() === 'dark';
  return (
    <View style={[styles.card, { backgroundColor: dark ? '#16171C' : '#fff' }]}>
      <Text style={[styles.h, { color: dark ? '#fff' : '#14151A' }]}>{title}</Text>
      {children}
    </View>
  );
}

export default function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [time, setTime] = useState(new Date());
  const [size, setSize] = useState('M');
  const [lang, setLang] = useState<string | null>(null);
  const [emoji, setEmoji] = useState('');
  const [sheet, setSheet] = useState<'date' | 'range' | 'time' | 'emoji' | null>(null);

  return (
    <PickersProvider theme={{ colors: { primary: '#4F46E5' } }}>
      <ScrollView contentContainerStyle={styles.page}>
        <Section title="Wheel">
          <WheelPicker items={['XS', 'S', 'M', 'L', 'XL', 'XXL']} value={size} onChange={setSize} />
        </Section>

        <Section title="Time">
          <TimePicker value={time} onChange={setTime} minuteInterval={5} />
          <Button title="Open time sheet" onPress={() => setSheet('time')} />
        </Section>

        <Section title="Date">
          <DatePicker value={date} onChange={setDate} minDate={new Date()} />
          <Button title={`Range: ${range.start ? formatDate(range.start) : '—'} → ${range.end ? formatDate(range.end) : '—'}`} onPress={() => setSheet('range')} />
          <Button title="Birthday (wheel sheet)" onPress={() => setSheet('date')} />
        </Section>

        <Section title="Select">
          <SelectPicker
            label="Language"
            placeholder="Choose a language"
            value={lang}
            onChange={(v) => setLang(v)}
            options={[
              { label: 'עברית', value: 'he', keywords: ['hebrew'] },
              { label: 'English', value: 'en' },
              { label: 'Français', value: 'fr' },
              { label: 'العربية', value: 'ar', keywords: ['arabic'] },
            ]}
          />
        </Section>

        <Section title="Emoji">
          <Text style={{ fontSize: 28 }}>{emoji || ' '}</Text>
          <EmojiPicker onSelect={(e) => setEmoji((s) => s + e)} height={320} />
          <Button title="Open emoji sheet" onPress={() => setSheet('emoji')} />
        </Section>
      </ScrollView>

      <TimePickerSheet visible={sheet === 'time'} onClose={() => setSheet(null)} title="Pick a time" value={time} onConfirm={setTime} />
      <DatePickerSheet visible={sheet === 'range'} onClose={() => setSheet(null)} title="Dates" mode="range" value={range} onConfirm={setRange} minDate={new Date()} />
      <DatePickerSheet visible={sheet === 'date'} onClose={() => setSheet(null)} title="Birthday" display="wheel" value={date} onConfirm={setDate} />
      <EmojiPickerSheet visible={sheet === 'emoji'} onClose={() => setSheet(null)} onSelect={(e) => setEmoji((s) => s + e)} />
    </PickersProvider>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 16, paddingTop: 60 },
  card: { borderRadius: 20, padding: 16, gap: 12 },
  h: { fontSize: 20, fontWeight: '700' },
  btn: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});
