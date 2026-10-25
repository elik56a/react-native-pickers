import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DatePicker, EmojiPicker, PickersProvider, SelectPicker, TimePicker, WheelPicker, usePickerTheme } from '@elik56a/react-native-pickers';
import type { DateRange } from '@elik56a/react-native-pickers';

const TABS = [
  { key: 'date', label: 'Date', icon: '📅' },
  { key: 'time', label: 'Time', icon: '⏰' },
  { key: 'wheel', label: 'Wheel', icon: '🎡' },
  { key: 'select', label: 'Select', icon: '📋' },
  { key: 'emoji', label: 'Emoji', icon: '😀' },
] as const;

type Tab = (typeof TABS)[number]['key'];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CITIES = ['Amsterdam', 'Berlin', 'Lisbon', 'London', 'New York', 'Paris', 'Rome', 'Tel Aviv', 'Tokyo'].map((c) => ({ label: c, value: c }));

function Screen() {
  const { colors } = usePickerTheme();
  const [tab, setTab] = useState<Tab>('date');
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [time, setTime] = useState(new Date());
  const [size, setSize] = useState('M');
  const [cities, setCities] = useState<string[]>(['Lisbon', 'Tokyo']);
  const [emoji, setEmoji] = useState('🎉');

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={s.body}>
        {tab === 'date' && <DatePicker mode="range" value={range} onChange={setRange} minDate={new Date()} dayHeight={40} />}
        {tab === 'time' && <TimePicker value={time} onChange={setTime} minuteInterval={5} />}
        {tab === 'wheel' && <WheelPicker items={SIZES} value={size} onChange={setSize} loop />}
        {tab === 'select' && (
          <SelectPicker multiple label="Trip cities" options={CITIES} value={cities} onChange={setCities} maxSelected={4} clearable />
        )}
        {tab === 'emoji' && (
          <>
            <Text style={s.emoji}>{emoji}</Text>
            <EmojiPicker height={300} columns={7} onSelect={(e) => setEmoji(e)} showSkinTones={false} />
          </>
        )}
      </View>
      <View style={[s.tabs, { borderTopColor: colors.border }]}>
        {TABS.map((t) => {
          const on = t.key === tab;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={s.tab} accessibilityRole="tab" accessibilityState={{ selected: on }}>
              <Text style={[s.tabIcon, { opacity: on ? 1 : 0.45 }]}>{t.icon}</Text>
              <Text style={[s.tabLabel, { color: on ? colors.primary : colors.textSecondary }]}>{t.label}</Text>
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
  root: { flex: 1, minHeight: 560 },
  body: { flex: 1, justifyContent: 'center', padding: 12 },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  tabs: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingBottom: 10 },
  tab: { flex: 1, alignItems: 'center', paddingTop: 8, gap: 2 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
