# react-native-pickers

[![npm](https://img.shields.io/npm/v/@elik56a/react-native-pickers)](https://www.npmjs.com/package/@elik56a/react-native-pickers) [![CI](https://github.com/elik56a/react-native-pickers/actions/workflows/ci.yml/badge.svg)](https://github.com/elik56a/react-native-pickers/actions/workflows/ci.yml) [![license](https://img.shields.io/npm/l/@elik56a/react-native-pickers)](LICENSE)

Beautiful, fully customizable pickers for React Native — **100% JavaScript, zero native code.**
Works with Expo Go, bare React Native, and React Native Web out of the box.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/elik56a/react-native-pickers/master/website/static/img/showcase-dark.png">
    <img alt="React Native date range picker, emoji picker, time picker and date-time picker from react-native-pickers" src="https://raw.githubusercontent.com/elik56a/react-native-pickers/master/website/static/img/showcase-light.png" width="640">
  </picture>
</p>

**📖 [Documentation & live examples](https://elik56a.github.io/react-native-pickers/)** · [Changelog](CHANGELOG.md) · [llms-full.txt](https://elik56a.github.io/react-native-pickers/llms-full.txt) for AI assistants

| | |
|---|---|
| 🎡 **WheelPicker** | iOS-style 3D wheel, infinite loop, disabled items, multi-column |
| ⏰ **TimePicker** | 12h / 24h (auto from locale), minute & second intervals, min/max time |
| 📅 **DatePicker** | Calendar (single · range · multiple) or wheel, min/max, disabled days, marked dates, i18n |
| 🗓️ **DateTimePicker** | Day + time in one wheel row (iOS-style) or a calendar with time wheels, min/max moments |
| 📋 **SelectPicker** | Field + bottom sheet, search (local or on your server, with a loader), groups, multi-select with chips, icons |
| ↔️ **HorizontalList** | Segmented control or chips that scroll sideways and reveal the next item |
| 😀 **EmojiPicker** | 1,900+ emojis, categories, search, skin tones, recents, version filtering |

Every picker comes **inline** and as a **sheet** (`DatePickerSheet`, `TimePickerSheet`, `DateTimePickerSheet`, `WheelPickerSheet`, `EmojiPickerSheet`) with Cancel / Done. A sheet is a bottom sheet with drag-to-dismiss or a centered modal (`presentation`); by default it's a modal on wide web windows and a bottom sheet everywhere else. `SelectPicker` can also open as a dropdown under its field, which is its default on the web.

In a form, use the **field** version (`DatePickerField`, `TimePickerField`, `DateTimePickerField`, `WheelPickerField`, `EmojiPickerField`): it looks like `SelectPicker`'s field, opens the picker on tap (a bottom sheet on native and a dropdown on the web by default; set `presentation` to choose), and shows the confirmed value once it closes. Pass `renderTrigger` for your own trigger, or wrap any sheet in `PickerField`.

```sh
npm install @elik56a/react-native-pickers
```

No other dependencies. Requires `react >= 18` and `react-native >= 0.72`.

On native, import from a feature subpath (`@elik56a/react-native-pickers/date`, `/select`, `/emoji`, …) so Metro only bundles the pickers you use. See [Smaller native bundles](https://elik56a.github.io/react-native-pickers/docs/getting-started/installation#smaller-native-bundles).

> **AI agents:** the full API docs ship with the package at `node_modules/@elik56a/react-native-pickers/llms-full.txt`, matching the installed version.

---

## Quick start

```tsx
import { DatePicker, TimePicker, SelectPicker, EmojiPicker, WheelPicker } from '@elik56a/react-native-pickers';

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

Or skip the open state and let a field own it. It shows the formatted value for `locale`:

```tsx
<DatePickerField label="Check-in / Check-out" mode="range" value={range} onConfirm={setRange} placeholder="Add dates" />
<TimePickerField label="Alarm" value={alarm} onConfirm={setAlarm} minuteInterval={5} />
<WheelPickerField label="Size" items={['S', 'M', 'L', 'XL']} value={size} onConfirm={setSize} />
```

Wheel, time, date and emoji pickers work **controlled** (`value` + `onChange`) or **uncontrolled** (`defaultValue`). `SelectPicker` and `SelectList` are controlled-only: always pass `value` and update it in `onChange`.

---

## Theming

Wrap your app (optional — sensible light & dark defaults apply without it):

```tsx
import { PickersProvider } from '@elik56a/react-native-pickers';

<PickersProvider
  colorScheme="auto" // 'auto' | 'light' | 'dark'
  theme={{ colors: { primary: '#FF5A5F' }, radius: { md: 8 }, typography: { fontFamily: 'Inter' } }}
  darkTheme={{ colors: { primary: '#FF8A8E', background: '#000' } }}
  design="auto" // 'auto' | 'ios' | 'material' | 'web'
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

### Designs

Each platform gets its own design by default (`design="auto"`): iOS on iOS, Material on Android, a web design on the web. A design changes shapes and layout, never your colors:

| | `ios` | `material` | `web` |
|---|---|---|---|
| Fields | label above, 48 tall | outlined, 56 tall; the label sits inside, then floats onto the border | label above, 40 tall, focus ring while open |
| Sheet corners | 24 | 28 | 12 |
| Cancel / confirm | beside a centered title, **Done** | after the content, **OK** | after the content, **Done** |
| Single select | ✓ beside the chosen option | a radio on every option | ✓ beside the chosen option |
| Option rows | rounded and tinted when chosen | edge to edge, untinted | compact, rounded and tinted |
| Date sheet | calendar | the picked date in large type above the calendar | calendar |
| Time | wheels | wheels | a list of times |
| HorizontalList | a sliding raised thumb; filled chips | outlined segments and chips, the chosen one filled with a ✓ | a sliding raised thumb; filled chips |
| Press | dims while held | ripple | dims while held |

Pick one design for every platform on the provider, or for one component with its `design` prop:

```tsx
<PickersProvider design="ios">…</PickersProvider>   // the iOS look everywhere
<SelectPicker design="material" … />                 // one component
```

Your `theme` overrides and explicit props such as `confirmLabel` always win over the design.

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

For full control: `renderItem` / `renderIndicator` (wheel), `renderDay` / `renderArrow` (calendar), `renderOption` / `renderTrigger` / `renderChevron` / `renderGroupHeader` (select), `renderEmoji` (emoji), `renderTrigger` / `renderChevron` (fields).

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
| `keyboardInput` | `boolean` | `true` | Tap the selected row to type a value; the wheel jumps to the first matching label |
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
| `display` | `'wheel' \| 'list'` | `'list'` in the web design, else `'wheel'` |
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
mode: 'ranges'    value: DateRange[]      onChange(ranges)  maxRanges, minRangeDays, maxRangeDays, allowSingleDayRange
```

The modes are also exported as constants: `mode={CALENDAR_MODE.ranges}`.

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

`SelectPicker` is a field that opens a bottom sheet, a modal or a dropdown (`presentation`); `SelectList` is the inline list.

```ts
options: { label, value, description?, icon?, group?, disabled?, keywords? }[]
multiple?: false   value: T | null   onChange(value, option)
multiple: true     value: T[]        onChange(values, options)   maxSelected
```

| Prop | Default | |
|---|---|---|
| `searchable` | `> 8 options` | Accent- and niqqud-insensitive |
| `filterOption` | | Custom search |
| `loadOptions` | | `(query) => Promise<options>`: search a server, with a loader, debounce and stale answers ignored |
| `searchDebounce` | `300` | ms after typing stops before searching |
| `onSearchChange` / `loading` / `onEndReached` | | Search yourself: fetch on each query, show a loader, load more |
| `loadingText` / `renderLoading` | `'Loading…'` | Custom loader |
| `searchPrompt` | `'Type to search'` | Shown before typing when a searched list has no options |
| `placeholder` / `label` / `sheetTitle` | | |
| `clearable` | `false` | |
| `chips` | `true` | Removable chips in multi mode |
| `presentation` | `'auto'` | `'bottomSheet'`, `'modal'` or `'dropdown'` (under the field). `auto`: dropdown on the web, bottom sheet on native |
| `closeOnSelect` | `true` | Single mode |
| `disabled` | `false` | |

### HorizontalList

A segmented control (default) or a row of chips that scrolls sideways. Tapping the item at the edge scrolls the next one into view, so users see there's more.

```tsx
import { HorizontalList } from '@elik56a/react-native-pickers';

<HorizontalList
  items={[
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ]}
  value={view}
  onChange={setView}
/>
```

| Prop | Default | |
|---|---|---|
| `items` | — | `{ label, value, disabled?, icon? }[]` |
| `value` / `onChange` | | Controlled; `onChange(value, item)` |
| `variant` | `'segmented'` | or `'chips'` |
| `renderItem` | | `({ item, selected, disabled, theme }) => ReactNode` |

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

### Picker fields

`DatePickerField`, `TimePickerField`, `DateTimePickerField`, `WheelPickerField` and `EmojiPickerField` take their sheet's props without `visible` (`value`, `onConfirm` or `onSelect`, `mode`, `locale`, `title`…), plus:

| Prop | Default | |
|---|---|---|
| `label` | | Above the field, and the sheet title unless `title` is set |
| `placeholder` | `'Select…'` | |
| `displayValue` | the value, formatted for `locale` | Text shown in the field |
| `clearable` / `onClear` | `false` | × button while there's a value; reset your value in `onClear` |
| `disabled` | `false` | |
| `renderTrigger` | | `({ open, displayValue, disabled }) => node`: your own trigger |
| `renderChevron` | | `({ open, theme }) => node` |
| `presentation` | `'auto'` | `'auto'` (a dropdown on the web, a bottom sheet on native), `'dropdown'`, `'bottomSheet'` or `'modal'` |
| `onOpen` / `onClose` | | |
| `style` / `styles` | | `styles` takes the field slots (`label trigger triggerText placeholder chevron clear`) and the picker's |

`EmojiPickerField` also takes `value`, the emoji to show. `PickerField` is the field on its own, for any sheet:

```tsx
<PickerField label="Filters" displayValue={summary}>
  {(sheet) => <BottomSheet {...sheet} title="Filters">…</BottomSheet>}
</PickerField>
```

### BottomSheet

Use the same sheet for your own content:

```tsx
<BottomSheet visible={open} onClose={close} title="Filters" footer={<ApplyButton />}>
  ...
</BottomSheet>
```

Props: `title`, `headerLeft`, `headerRight`, `footer`, `presentation`, `enableSwipeToClose`, `draggable`, `expandable`, `expandedHeight`, `closeOnBackdropPress`, `height`, `maxHeightRatio`, `bottomInset`, `styles`.

---

## RTL & i18n

Layouts use logical `start` / `end`, so they flip automatically with `I18nManager.isRTL`; calendar arrows and swipe direction follow. All month, weekday, and AM/PM names come from `Intl` (Hermes supports it), with English fallbacks. Every user-facing string (Done, Cancel, Search, empty states, category labels) is a prop.

On React Native Web, select labels are pinned to the left edge so options in different scripts line up (the browser would otherwise align Hebrew or Arabic labels right). For an RTL web app, set `textAlign: 'right'` through the `optionLabel`, `triggerText` and `placeholder` slot styles.

## Accessibility

Wheels are `adjustable` with increment / decrement actions for VoiceOver and TalkBack. Days announce their full date, and selected / disabled states are exposed everywhere.

## Performance

Animations run on the native driver. Wheels and the emoji grid are virtualized `FlatList`s with fixed row layouts, and rows are memoized so scrolling re-renders only the two rows that change.

## Development

A pnpm workspace: the library at the root, an Expo example app in [`example/`](example) that renders against `src/` (edits hot-reload), and the docs site in [`website/`](website).

```sh
pnpm install        # also installs the git hooks (lefthook)

pnpm web            # example app in the browser
pnpm ios            # example app in the iOS Simulator
pnpm android        # example app in the Android emulator
pnpm docs           # docs site at localhost:3000

pnpm test           # Jest + React Native Testing Library
pnpm lint           # Biome: lint, format and import order
pnpm format         # fix whatever lint can fix
pnpm typecheck
pnpm build          # lib/ (ESM + .d.ts)
pnpm gen:emoji      # regenerate emoji data from emojibase-data
```

### Project structure

Each picker lives in its own folder under `src/` (`wheel`, `time`, `calendar`, `date`, `datetime`, `select`, `emoji`), on top of `sheet` (bottom sheets and fields) and `core` (theme, shared hooks and utils). Imports flow feature → `sheet` → `core`, and every folder has the same layout:

```
src/select/
├─ SelectPicker.tsx        components render only
├─ components/             smaller render-only parts
├─ hooks/                  state and event handling
├─ select.utils.ts         pure logic, with select.utils.test.ts next to it
├─ select.types.ts · select.constants.ts · select.styles.ts
├─ SelectPicker.test.tsx   interaction tests (React Native Testing Library)
└─ index.ts                the folder's public API
```

### Conventions

- Tests sit next to the file they test.
- Arrow functions (`export const fn = () =>`), and returned objects with 2+ properties go one property per line. A Biome plugin in [`lint/`](lint) enforces this, and `pnpm format` fixes it.
- Imports come in three blocks: React and React Native, other packages, then our own code.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `refactor(select):` …). The commit hook checks each commit, and CI checks the PR title, since PRs are squash-merged.

The pre-commit hook formats and lints the staged files and runs typecheck. CI runs lint, typecheck, tests and the build on every pull request.

### Releasing

CI publishes to npm ([`.github/workflows/release.yml`](.github/workflows/release.yml)). Either run **Release** from the Actions tab and pick patch / minor / major, or push a version tag yourself:

```sh
npm version patch -m "chore(release): v%s"  # or minor / major: bumps package.json, commits, tags vX.Y.Z
git push origin master --follow-tags        # tag → lint, typecheck, test, build, npm publish; master → docs deploy
```

Emoji data comes from [emojibase](https://emojibase.dev) (MIT).

## License

MIT
