import type React from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DateRange } from '@elik56a/react-native-pickers';
import {
  DatePicker,
  DatePickerField,
  DatePickerSheet,
  DateTimePicker,
  DateTimePickerField,
  DateTimePickerSheet,
  EmojiPicker,
  EmojiPickerField,
  EmojiPickerSheet,
  formatDate,
  PickersProvider,
  SelectPicker,
  TimePicker,
  TimePickerField,
  TimePickerSheet,
  usePickerTheme,
  WheelPicker,
  WheelPickerField,
} from '@elik56a/react-native-pickers';

const TABS = [
  { key: 'wheel', label: 'Wheel', icon: '🎡' },
  { key: 'time', label: 'Time', icon: '🕐' },
  { key: 'date', label: 'Date', icon: '📅' },
  { key: 'datetime', label: 'Date & time', icon: '🗓️' },
  { key: 'select', label: 'Select', icon: '🔽' },
  { key: 'emoji', label: 'Emoji', icon: '😀' },
  { key: 'form', label: 'Form', icon: '📝' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function Button({ title, onPress }: { title: string; onPress: () => void }) {
  const { colors } = usePickerTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}>
      <Text style={[styles.btnText, { color: colors.onPrimary }]}>{title}</Text>
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = usePickerTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <Text style={[styles.h, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function TabBar({ active, onChange, bottomInset }: { active: TabKey; onChange: (tab: TabKey) => void; bottomInset: number }) {
  const { colors } = usePickerTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={[styles.tabBar, { paddingBottom: bottomInset, backgroundColor: colors.background, borderTopColor: colors.border }]}
    >
      {TABS.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
          >
            <Text style={[styles.tabIcon, { opacity: selected ? 1 : 0.5 }]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, { color: selected ? colors.primary : colors.textSecondary }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type Insets = { top: number; bottom: number };

export default function App({ insets = { top: 0, bottom: 0 } }: { insets?: Insets }) {
  return (
    <PickersProvider>
      <Demo insets={insets} />
    </PickersProvider>
  );
}

function Demo({ insets }: { insets: Insets }) {
  const { colors } = usePickerTheme();
  const [tab, setTab] = useState<TabKey>('wheel');
  const [date, setDate] = useState<Date>(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [time, setTime] = useState(new Date());
  const [meeting, setMeeting] = useState(new Date());
  const [size, setSize] = useState('M');
  const [lang, setLang] = useState<string | null>(null);
  const [framework, setFramework] = useState<string | null>(null);
  const [emoji, setEmoji] = useState('');
  const [mood, setMood] = useState<string | undefined>();
  const [sheet, setSheet] = useState<'date' | 'range' | 'time' | 'datetime' | 'emoji' | null>(null);

  return (
    <>
      <View style={[styles.root, { backgroundColor: colors.surface }]}>
        <View style={[styles.page, { paddingTop: insets.top + 16 }]}>
          {tab === 'wheel' && (
            <Section title="Wheel">
              <WheelPicker items={['XS', 'S', 'M', 'L', 'XL', 'XXL']} value={size} onChange={setSize} />
            </Section>
          )}

          {tab === 'time' && (
            <Section title="Time">
              <TimePicker value={time} onChange={setTime} minuteInterval={5} />
              <Button title="Open time sheet" onPress={() => setSheet('time')} />
            </Section>
          )}

          {tab === 'date' && (
            <Section title="Date">
              <DatePicker value={date} onChange={setDate} minDate={new Date()} />
              <Button
                title={`Range: ${range.start ? formatDate(range.start) : '—'} → ${range.end ? formatDate(range.end) : '—'}`}
                onPress={() => setSheet('range')}
              />
              <Button title="Birthday (wheel sheet)" onPress={() => setSheet('date')} />
            </Section>
          )}

          {tab === 'datetime' && (
            <Section title="Date & time">
              <DateTimePicker value={meeting} onChange={setMeeting} minDate={new Date()} minuteInterval={5} />
              <Button title="Open calendar sheet" onPress={() => setSheet('datetime')} />
            </Section>
          )}

          {tab === 'select' && (
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
              <SelectPicker
                label="Framework (dropdown)"
                placeholder="Choose a framework"
                presentation="dropdown"
                value={framework}
                onChange={(v) => setFramework(v)}
                options={['Expo', 'React Native CLI', 'React Native Web', 'Next.js', 'Remix', 'Vite'].map((label) => ({
                  label,
                  value: label,
                }))}
              />
            </Section>
          )}

          {tab === 'emoji' && (
            <Section title="Emoji">
              <Text style={styles.emoji}>{emoji || ' '}</Text>
              <EmojiPicker onSelect={(e) => setEmoji((s) => s + e)} height={320} />
              <Button title="Open emoji sheet" onPress={() => setSheet('emoji')} />
            </Section>
          )}

          {tab === 'form' && (
            <Section title="Form fields">
              <DatePickerField
                label="Stay"
                placeholder="Add dates"
                mode="range"
                value={range}
                onConfirm={setRange}
                minDate={new Date()}
                clearable
                onClear={() => setRange({ start: null, end: null })}
              />
              <DatePickerField label="Birthday" display="wheel" value={date} onConfirm={setDate} />
              <TimePickerField label="Alarm" value={time} onConfirm={setTime} minuteInterval={5} />
              <DateTimePickerField label="Meeting" display="calendar" value={meeting} onConfirm={setMeeting} minDate={new Date()} />
              <WheelPickerField label="Size" items={['XS', 'S', 'M', 'L', 'XL', 'XXL']} value={size} onConfirm={setSize} />
              <EmojiPickerField label="Mood" placeholder="Pick an emoji" value={mood} onSelect={setMood} />
            </Section>
          )}
        </View>

        <TabBar active={tab} onChange={setTab} bottomInset={insets.bottom} />
      </View>

      <TimePickerSheet visible={sheet === 'time'} onClose={() => setSheet(null)} title="Pick a time" value={time} onConfirm={setTime} />
      <DateTimePickerSheet
        visible={sheet === 'datetime'}
        onClose={() => setSheet(null)}
        title="Meeting"
        display="calendar"
        value={meeting}
        onConfirm={setMeeting}
        minDate={new Date()}
        minuteInterval={5}
      />
      <DatePickerSheet
        visible={sheet === 'range'}
        onClose={() => setSheet(null)}
        title="Dates"
        mode="range"
        value={range}
        onConfirm={setRange}
        minDate={new Date()}
      />
      <DatePickerSheet
        visible={sheet === 'date'}
        onClose={() => setSheet(null)}
        title="Birthday"
        display="wheel"
        value={date}
        onConfirm={setDate}
      />
      <EmojiPickerSheet visible={sheet === 'emoji'} onClose={() => setSheet(null)} onSelect={(e) => setEmoji((s) => s + e)} />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  page: { flex: 1, padding: 16 },
  card: { borderRadius: 20, padding: 16, gap: 12 },
  h: { fontSize: 20, fontWeight: '700' },
  btn: { borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnText: { fontWeight: '600' },
  emoji: { fontSize: 28 },
  tabBar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, gap: 2 },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
