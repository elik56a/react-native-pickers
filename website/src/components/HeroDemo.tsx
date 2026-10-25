import type { DateRange } from '@elik56a/react-native-pickers';
import {
  DatePicker,
  EmojiPicker,
  PickersProvider,
  SelectList,
  TimePicker,
  usePickerTheme,
  WheelPicker,
} from '@elik56a/react-native-pickers';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const TABS = [
  { key: 'date', label: 'Date', title: 'Book your stay', subtitle: 'Tap check-in, then check-out' },
  { key: 'time', label: 'Time', title: 'Wake me at', subtitle: '5-minute steps, locale clock' },
  { key: 'wheel', label: 'Wheel', title: 'Pick a size', subtitle: 'Looping 3D wheel' },
  { key: 'select', label: 'Select', title: 'Trip cities', subtitle: 'Search and pick up to 4' },
  { key: 'emoji', label: 'Emoji', title: 'React', subtitle: '1,906 emojis with search' },
] as const;

type Tab = (typeof TABS)[number]['key'];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CITIES = ['Amsterdam', 'Berlin', 'Lisbon', 'London', 'New York', 'Paris', 'Rome', 'Tel Aviv', 'Tokyo'].map((c) => ({
  label: c,
  value: c,
}));

function Screen() {
  const { colors } = usePickerTheme();
  const [tab, setTab] = useState<Tab>('date');
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [time, setTime] = useState(new Date());
  const [size, setSize] = useState('M');
  const [cities, setCities] = useState<string[]>(['Lisbon', 'Tokyo']);
  const [emoji, setEmoji] = useState('🎉');
  const active = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={s.header}>
        <Text style={[s.title, { color: colors.text }]}>
          {active.title}
          {tab === 'emoji' ? ` ${emoji}` : ''}
        </Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>{active.subtitle}</Text>
      </View>
      <View style={s.body}>
        {tab === 'date' && <DatePicker mode="range" value={range} onChange={setRange} minDate={new Date()} dayHeight={48} />}
        {tab === 'time' && <TimePicker value={time} onChange={setTime} minuteInterval={5} />}
        {tab === 'wheel' && <WheelPicker items={SIZES} value={size} onChange={setSize} loop />}
        {tab === 'select' && (
          <SelectList multiple searchable options={CITIES} value={cities} onChange={setCities} maxSelected={4} listHeight={360} />
        )}
        {tab === 'emoji' && <EmojiPicker height={300} columns={7} onSelect={setEmoji} showSkinTones={false} />}
      </View>
      <View accessibilityRole="tablist" style={[s.segmented, { backgroundColor: colors.surface }]}>
        {TABS.map((t) => {
          const on = t.key === tab;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={[s.segment, on && { backgroundColor: colors.text }]}
            >
              <Text style={[s.segmentLabel, { color: on ? colors.background : colors.textSecondary }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function HeroDemo({ colorMode }: { colorMode: 'light' | 'dark' }) {
  return (
    <PickersProvider colorScheme={colorMode}>
      <Screen />
    </PickersProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, height: '100%', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 26 },
  header: { paddingHorizontal: 6, paddingBottom: 8, gap: 2 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { fontSize: 13 },
  body: { flex: 1, justifyContent: 'center' },
  segmented: { flexDirection: 'row', borderRadius: 999, padding: 4, marginTop: 8 },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 999 },
  segmentLabel: { fontSize: 12, fontWeight: '600' },
});
