import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import type { DateRange } from '@elik56a/react-native-pickers';
import {
  DatePicker,
  EmojiPicker,
  PickersProvider,
  SelectPicker,
  TimePicker,
  usePickerTheme,
  WheelPicker,
} from '@elik56a/react-native-pickers';

const TABS = [
  { key: 'date', label: 'Date', title: 'Book your stay', subtitle: 'Tap check-in, then check-out' },
  { key: 'time', label: 'Time', title: 'Wake me at', subtitle: '5-minute steps, locale clock' },
  { key: 'wheel', label: 'Wheel', title: 'Pick a size', subtitle: 'Looping 3D wheel' },
  { key: 'select', label: 'Select', title: 'Plan a trip', subtitle: 'Tap a field to pick' },
  { key: 'emoji', label: 'Emoji', title: 'React', subtitle: '1,906 emojis with search' },
] as const;

type Tab = (typeof TABS)[number]['key'];

export type DemoPlatform = 'ios' | 'android' | 'web';

/** The phone flips through the tabs on its own until the visitor touches it. */
const AUTOPLAY_MS = 3200;
const TAB_FADE_MS = 280;
const DAY_MS = 864e5;
const SEGMENTED_PADDING = 4;

const nightsFromNow = (from: number, to: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    start: new Date(+today + from * DAY_MS),
    end: new Date(+today + to * DAY_MS),
  };
};

/** Keeps an expanded sheet below the mock status bar. */
const PHONE_STATUS_BAR = 52;
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CITIES = ['Amsterdam', 'Berlin', 'Lisbon', 'London', 'New York', 'Paris', 'Rome', 'Tel Aviv', 'Tokyo'].map((c) => ({
  label: c,
  value: c,
}));
const CABINS = ['Economy', 'Premium', 'Business', 'First'].map((c) => ({
  label: c,
  value: c,
}));

function Screen({ platform, phoneHeight }: { platform: DemoPlatform; phoneHeight?: number }) {
  const { colors } = usePickerTheme();
  const [tab, setTab] = useState<Tab>('date');
  const [autoplay, setAutoplay] = useState(true);
  const fade = useRef(new Animated.Value(1)).current;
  const pill = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);
  const [range, setRange] = useState<DateRange>(() => nightsFromNow(1, 4));
  const [time, setTime] = useState(new Date());
  const [size, setSize] = useState('M');
  const [cities, setCities] = useState<string[]>(['Lisbon', 'Tokyo']);
  const [cabin, setCabin] = useState<string | null>('Economy');
  const [emoji, setEmoji] = useState('🎉');
  const presentation = platform === 'web' ? 'dropdown' : 'bottomSheet';
  const sheet = {
    sheetProps: {
      bottomInset: platform === 'ios' ? 30 : 16,
      draggable: true,
      expandedHeight: phoneHeight ? phoneHeight - PHONE_STATUS_BAR : undefined,
    },
  };
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => t.key === tab)
  );
  const active = TABS[activeIndex];

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setTab((t) => TABS[(TABS.findIndex((x) => x.key === t) + 1) % TABS.length].key), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplay]);

  useEffect(() => {
    Animated.spring(pill, { toValue: activeIndex * tabWidth, useNativeDriver: false, speed: 14, bounciness: 7 }).start();
  }, [activeIndex, pill, tabWidth]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: replays the fade on every tab switch
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: TAB_FADE_MS, useNativeDriver: false }).start();
  }, [fade, tab]);

  return (
    <View
      style={[s.root, { backgroundColor: colors.background }]}
      onStartShouldSetResponderCapture={() => {
        setAutoplay(false);
        return false;
      }}
    >
      <View style={s.header}>
        <Text style={[s.title, { color: colors.text }]}>
          {active.title}
          {tab === 'emoji' ? ` ${emoji}` : ''}
        </Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>{active.subtitle}</Text>
      </View>
      <Animated.View
        style={[
          s.body,
          {
            opacity: fade,
            transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
          },
        ]}
      >
        {tab === 'date' && <DatePicker mode="range" value={range} onChange={setRange} minDate={new Date()} dayHeight={48} />}
        {tab === 'time' && <TimePicker value={time} onChange={setTime} minuteInterval={5} />}
        {tab === 'wheel' && <WheelPicker items={SIZES} value={size} onChange={setSize} loop />}
        {tab === 'select' && (
          <View style={s.form}>
            <SelectPicker
              label="Cities"
              multiple
              searchable
              options={CITIES}
              value={cities}
              onChange={setCities}
              maxSelected={4}
              listHeight={240}
              presentation={presentation}
              sheet={sheet}
            />
            <SelectPicker label="Cabin" options={CABINS} value={cabin} onChange={setCabin} presentation={presentation} sheet={sheet} />
          </View>
        )}
        {tab === 'emoji' && <EmojiPicker height={300} columns={7} onSelect={setEmoji} showSkinTones={false} />}
      </Animated.View>
      <View
        accessibilityRole="tablist"
        style={[s.segmented, { backgroundColor: colors.surface }]}
        onLayout={(e) => setTabWidth((e.nativeEvent.layout.width - SEGMENTED_PADDING * 2) / TABS.length)}
      >
        <Animated.View style={[s.pill, { width: tabWidth, backgroundColor: colors.text, transform: [{ translateX: pill }] }]} />
        {TABS.map((t) => {
          const on = t.key === tab;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={s.segment}
            >
              <Text style={[s.segmentLabel, { color: on ? colors.background : colors.textSecondary }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function HeroDemo({
  colorMode,
  platform,
  phoneHeight,
}: {
  colorMode: 'light' | 'dark';
  platform: DemoPlatform;
  phoneHeight?: number;
}) {
  return (
    <PickersProvider colorScheme={colorMode}>
      <Screen platform={platform} phoneHeight={phoneHeight} />
    </PickersProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, height: '100%', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 26 },
  header: { paddingHorizontal: 6, paddingBottom: 8, gap: 2 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { fontSize: 13 },
  body: { flex: 1, justifyContent: 'center' },
  form: { flex: 1, gap: 16, paddingTop: 12 },
  segmented: { flexDirection: 'row', borderRadius: 999, padding: SEGMENTED_PADDING, marginTop: 8 },
  pill: { position: 'absolute', top: SEGMENTED_PADDING, bottom: SEGMENTED_PADDING, left: SEGMENTED_PADDING, borderRadius: 999 },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 999 },
  segmentLabel: { fontSize: 12, fontWeight: '600' },
});
