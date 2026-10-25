# react-native-pickers

Beautiful, fully customizable pickers for React Native — **100% JavaScript, zero native code.**
Works with Expo Go, bare React Native, and React Native Web out of the box.

| | |
|---|---|
| 🎡 **WheelPicker** | iOS-style 3D wheel, infinite loop, disabled items, multi-column |
| ⏰ **TimePicker** | 12h / 24h (auto from locale), minute & second intervals, min/max time |
| 📅 **DatePicker** | Calendar (single · range · multiple) or wheel, min/max, disabled days, marked dates, i18n |
| 📋 **SelectPicker** | Field + bottom sheet, search, groups, multi-select with chips, icons |
| 😀 **EmojiPicker** | 1,900+ emojis, categories, search, skin tones, recents, version filtering |

Every picker also ships as a **bottom sheet** (`DatePickerSheet`, `TimePickerSheet`, `WheelPickerSheet`, `EmojiPickerSheet`), with drag-to-dismiss and Cancel / Done.

```sh
npm install @eliyahu/react-native-pickers
```

No other dependencies. Requires `react >= 18` and `react-native >= 0.72`.

---

## Quick start

```tsx
import { DatePicker, TimePicker, SelectPicker, EmojiPicker, WheelPicker } from '@eliyahu/react-native-pickers';

<WheelPicker items={['S', 'M', 'L', 'XL']} value={size} onChange={setSize} />

<TimePicker value={time} onChange={setTime} minuteInterval={5} />

<DatePicker value={date} onChange={setDate} minDate={new Date()} />
<DatePicker mode="range" value={range} onChange={setRange} />
<DatePicker display="wheel" value={birthday} onChange={setBirthday} />

<SelectPicker label="Country" options={countries} value={country} onChange={setCountry} />

<EmojiPicker onSelect={(emoji) => setText((t) => t + emoji)} />
```

Bottom sheets keep a draft and only commit on **Done**:

```tsx
<DatePickerSheet
  visible={open}
  onClose={() => setOpen(false)}
  title="Check-in / Check-out"
  mode="range"
  value={range}
  onConfirm={setRange}
/>
```

Every picker works **controlled** (`value` + `onChange`) or **uncontrolled** (`defaultValue`).

---

## Theming

Wrap your app (optional — sensible light & dark defaults apply without it):

```tsx
import { PickersProvider } from '@eliyahu/react-native-pickers';

<PickersProvider
  colorScheme="auto" // 'auto' | 'light' | 'dark'
  theme={{ colors: { primary: '#FF5A5F' }, radius: { md: 8 }, typography: { fontFamily: 'Inter' } }}
  darkTheme={{ colors: { primary: '#FF8A8E', background: '#000' } }}
>
  <App />
</PickersProvider>
```

Any component also accepts `theme` for a local override. Available tokens:

- `colors`: background, surface, sheet, text, textSecondary, textDisabled, primary, onPrimary, primaryMuted, border, backdrop, indicator, handle
- `radius`: sm, md, lg, full, sheet
- `spacing`: xs, sm, md, lg, xl
- `typography`: fontFamily, fontFamilyMedium, sizes, weights
- `animation`: duration

### Slot styles

Every visual part is reachable through `styles`, so you never have to fork:

```tsx
<DatePicker
  styles={{
    selectedDay: { borderRadius: 8 },
    dayText: { fontFamily: 'Inter' },
    rangeBand: { backgroundColor: '#FFE4E6' },
    headerTitle: { fontSize: 20 },
  }}
/>
```

### Render props

For full control: `renderItem` / `renderIndicator` (wheel), `renderDay` / `renderArrow` (calendar), `renderOption` / `renderTrigger` / `renderGroupHeader` (select), `renderEmoji` (emoji).

---

## API

### WheelPicker

| Prop | Type | Default | |
|---|---|---|---|
| `items` | `(T \| { label, value, disabled? })[]` | — | Primitives or objects |
| `value` / `defaultValue` | `T` | — | |
| `onChange` | `(value, index) => void` | — | Fires when the wheel settles |
| `onValueChanging` | `(value, index) => void` | — | Fires on every tick — hook haptics here |
| `itemHeight` | `number` | `40` | |
| `visibleItems` | `number` (odd) | `5` | |
| `loop` | `boolean` | `false` | Infinite wheel |
| `variant` | `'3d' \| 'flat'` | `'3d'` | |
| `rotation` | `number` | `20` | Degrees between rows (3d) |
| `fadeTo` | `number` | `0.3` | Opacity of the farthest rows |
| `isEqual` | `(a, b) => boolean` | `Object.is` | For object values |
| `styles` | slots: `container item itemText selectedItemText disabledItemText indicator` | | |

`MultiWheelPicker` renders several wheels sharing one selection band: `columns={[{ key, items, value, onChange, flex, loop }]}` and an optional `separator`.

Haptics example (no dependency imposed — bring your own):

```tsx
import * as Haptics from 'expo-haptics';
<WheelPicker onValueChanging={() => Haptics.selectionAsync()} ... />
```

### TimePicker

| Prop | Type | Default |
|---|---|---|
| `value` / `defaultValue` | `Date` | now |
| `onChange` / `onValueChanging` | `(date) => void` | |
| `format` | `'12h' \| '24h' \| 'auto'` | `'auto'` (from `locale`) |
| `locale` | `string` | device |
| `minuteInterval` | `number` | `1` |
| `showSeconds` / `secondInterval` | `boolean` / `number` | `false` / `1` |
| `minTime` / `maxTime` | `Date` (time of day) | |
| `loop` | `boolean` | `true` |
| `dayPeriodLabels` | `[am, pm]` | from locale |
| `dayPeriodFirst` | `boolean` | `false` |

### DatePicker

`display="calendar"` (default) or `display="wheel"`.

Selection modes:

```ts
mode?: 'single'   value: Date | null      onChange(date)
mode: 'range'     value: { start, end }   onChange(range)   minRangeDays, maxRangeDays, allowSingleDayRange
mode: 'multiple'  value: Date[]           onChange(dates)   maxSelections
```

| Prop | Type | Default | |
|---|---|---|---|
| `minDate` / `maxDate` | `Date` | | |
| `isDateDisabled` | `(date) => boolean` | | e.g. weekends |
| `markedDates` | `{ 'YYYY-MM-DD': { dots?, label?, disabled?, textColor? } }` | | Dots, prices, events |
| `locale` | `string` | device | Month & weekday names via `Intl` |
| `firstDayOfWeek` | `0–6` | from locale | |
| `showOutsideDays` / `fixedWeeks` | `boolean` | `true` | |
| `enableSwipe` | `boolean` | `true` | Swipe between months |
| `enableQuickJump` | `boolean` | `true` | Tap title → month grid → year grid |
| `weekdayFormat` | `'short' \| 'narrow'` | `'short'` | |
| `dayHeight` | `number` | `44` | |
| `onMonthChange` | `(month) => void` | | |

Ranges never cross disabled days — tapping past one starts a new range.

Wheel mode: `order` (`['day','month','year']`, defaults from locale), `monthFormat` (`'long' | 'short' | 'numeric'`), `yearRange`.

### SelectPicker / SelectList

`SelectPicker` is a field that opens a sheet; `SelectList` is the inline list.

```ts
options: { label, value, description?, icon?, group?, disabled?, keywords? }[]
multiple?: false   value: T | null   onChange(value, option)
multiple: true     value: T[]        onChange(values, options)   maxSelected
```

| Prop | Default | |
|---|---|---|
| `searchable` | `> 8 options` | Accent- and niqqud-insensitive |
| `filterOption` | | Custom search |
| `placeholder` / `label` / `sheetTitle` | | |
| `clearable` | `false` | |
| `chips` | `true` | Removable chips in multi mode |
| `closeOnSelect` | `true` | Single mode |
| `disabled` | `false` | |

### EmojiPicker

| Prop | Default | |
|---|---|---|
| `onSelect` | — | `(emoji: string, data: Emoji) => void` |
| `columns` / `emojiSize` / `height` | `8` / auto / `380` | |
| `categories` | all | Filter & reorder |
| `exclude` | | Characters to hide |
| `maxEmojiVersion` | | Hide emojis older devices can't render |
| `skinTone` / `defaultSkinTone` / `onSkinToneChange` | `0` | 0 = default, 1–5 light → dark |
| `recent` / `defaultRecent` / `onRecentChange` / `maxRecent` | `[]` / `24` | Persist with your own storage |
| `categoryBarPosition` | `'top'` | or `'bottom'` |
| `categoryLabels` / `categoryIcons` | | i18n and custom icons |
| `searchPlaceholder` / `emptyText` | | |

Persisting recents with AsyncStorage:

```tsx
const [recent, setRecent] = useState<string[]>([]);
useEffect(() => { AsyncStorage.getItem('recent').then((v) => v && setRecent(JSON.parse(v))); }, []);

<EmojiPicker
  recent={recent}
  onRecentChange={(r) => { setRecent(r); AsyncStorage.setItem('recent', JSON.stringify(r)); }}
  onSelect={...}
/>
```

Utilities: `getAllEmojis()`, `searchEmojis(query)`, `findEmoji(char)`, `withSkinTone(emoji, tone)`.

### BottomSheet

Use the same sheet for your own content:

```tsx
<BottomSheet visible={open} onClose={close} title="Filters" footer={<ApplyButton />}>
  ...
</BottomSheet>
```

Props: `title`, `headerLeft`, `headerRight`, `footer`, `enableSwipeToClose`, `closeOnBackdropPress`, `height`, `maxHeightRatio`, `bottomInset`, `styles`.

---

## RTL & i18n

Layouts use logical `start` / `end`, so they flip automatically with `I18nManager.isRTL`; calendar arrows and swipe direction follow. All month, weekday, and AM/PM names come from `Intl` (Hermes supports it), with English fallbacks. Every user-facing string (Done, Cancel, Search, empty states, category labels) is a prop.

## Accessibility

Wheels are `adjustable` with increment / decrement actions for VoiceOver and TalkBack. Days announce their full date, and selected / disabled states are exposed everywhere.

## Performance

Animations run on the native driver. Wheels and the emoji grid are virtualized `FlatList`s with fixed row layouts, and rows are memoized so scrolling re-renders only the two rows that change.

## Development

```sh
npm test            # unit tests
npm run typecheck
npm run build       # lib/ (ESM + .d.ts)
npm run example:web # bundles example/App.tsx for React Native Web → example/web/dist
npm run gen:emoji   # regenerate emoji data from emojibase-data
```

Emoji data comes from [emojibase](https://emojibase.dev) (MIT).

## License

MIT
