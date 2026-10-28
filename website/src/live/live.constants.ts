import type { LiveControl, LiveOption } from './live.types';

export const PACKAGE = '@elik56a/react-native-pickers';
export const SANDBOX_TITLE = 'React Native Pickers example';

const BOOLEAN: readonly LiveOption[] = [false, true];

const FIELDS = ['DatePickerField', 'TimePickerField', 'DateTimePickerField', 'WheelPickerField', 'EmojiPickerField', 'PickerField'];
const SHEETS = [
  'DatePickerSheet',
  'TimePickerSheet',
  'DateTimePickerSheet',
  'WheelPickerSheet',
  'EmojiPickerSheet',
  'PickerSheet',
  'BottomSheet',
];
const TIME = ['TimePicker', 'TimePickerField', 'TimePickerSheet'];
const DATE_TIME = ['DateTimePicker', 'DateTimePickerField', 'DateTimePickerSheet'];
const EMOJI = ['EmojiPicker', 'EmojiPickerField', 'EmojiPickerSheet'];

/**
 * The side panel's props, offered for every live example that renders one of their components.
 * Only props that keep the example's value valid: `mode` and `multiple` change the value's shape, and DatePicker's `display` too.
 * A prop listed twice (e.g. `presentation`) becomes one control; the first entry an example matches sets its options.
 */
export const LIVE_CONTROLS: readonly LiveControl[] = [
  { prop: 'presentation', components: [...FIELDS, 'SelectPicker'], options: ['auto', 'dropdown', 'bottomSheet', 'modal'], default: 'auto' },
  { prop: 'presentation', components: SHEETS, options: ['auto', 'bottomSheet', 'modal'], default: 'auto' },
  { prop: 'display', components: DATE_TIME, options: ['wheel', 'calendar'], default: 'wheel' },
  { prop: 'format', components: [...TIME, ...DATE_TIME], options: ['auto', '12h', '24h'], default: 'auto' },
  { prop: 'showSeconds', components: TIME, options: BOOLEAN, default: false },
  {
    prop: 'variant',
    components: ['WheelPicker', 'MultiWheelPicker', 'DateWheelPicker', ...TIME, 'WheelPickerField', 'WheelPickerSheet'],
    options: ['3d', 'flat'],
    default: '3d',
  },
  { prop: 'loop', components: ['WheelPicker'], options: BOOLEAN, default: false },
  { prop: 'loop', components: ['DateWheelPicker'], options: BOOLEAN, default: true },
  { prop: 'monthFormat', components: ['DateWheelPicker'], options: ['long', 'short', 'numeric'], default: 'long' },
  { prop: 'weekdayFormat', components: ['DatePicker', 'Calendar'], options: ['short', 'narrow'], default: 'short' },
  { prop: 'showOutsideDays', components: ['DatePicker', 'Calendar'], options: BOOLEAN, default: true },
  { prop: 'categoryBarPosition', components: EMOJI, options: ['auto', 'top', 'bottom'], default: 'auto' },
  { prop: 'showSkinTones', components: EMOJI, options: BOOLEAN, default: true },
  { prop: 'clearable', components: [...FIELDS, 'SelectPicker'], options: BOOLEAN, default: false, requires: /\bonClear=/ },
  { prop: 'disabled', components: [...FIELDS, 'SelectPicker'], options: BOOLEAN, default: false },
];

export const SNACK_URL = 'https://snack.expo.dev/';
export const STACKBLITZ_URL = 'https://stackblitz.com/run';

/** Pinned to the versions the docs run, so a sandbox renders what the reader just saw. */
export const WEB_DEPENDENCIES = {
  [PACKAGE]: 'latest',
  react: '19.1.0',
  'react-dom': '19.1.0',
  'react-native-web': '0.21.4',
};

export const WEB_DEV_DEPENDENCIES = {
  '@vitejs/plugin-react': '^5.0.0',
  vite: '^7.0.0',
};

/** The pickers' source on GitHub: `src/<folder>/<Component>.tsx`. */
export const SOURCE_URL = 'https://github.com/elik56a/react-native-pickers/blob/master/src/';

/** Each component's folder under `src/`, for its source link and to name a sandbox's example file after it. */
export const COMPONENT_FOLDERS: Record<string, string> = {
  Calendar: 'calendar',
  DatePicker: 'date',
  DatePickerField: 'date',
  DatePickerSheet: 'date',
  DateWheelPicker: 'date',
  DateTimePicker: 'datetime',
  DateTimePickerField: 'datetime',
  DateTimePickerSheet: 'datetime',
  EmojiPicker: 'emoji',
  EmojiPickerField: 'emoji',
  EmojiPickerSheet: 'emoji',
  HorizontalList: 'list',
  SelectList: 'select',
  SelectPicker: 'select',
  BottomSheet: 'sheet',
  Dropdown: 'sheet',
  PickerField: 'sheet',
  PickerSheet: 'sheet',
  SheetContent: 'sheet',
  TimePicker: 'time',
  TimePickerField: 'time',
  TimePickerSheet: 'time',
  MultiWheelPicker: 'wheel',
  WheelPicker: 'wheel',
  WheelPickerField: 'wheel',
  WheelPickerSheet: 'wheel',
};

/** Names too generic for a sandbox file; the example's main component names it instead. */
export const GENERIC_EXAMPLE_NAMES = ['Example', 'App'];

/** Every sandbox renders the example like the docs preview, with the library's own HorizontalList floating in a corner to try it as on iOS, Android or the web. */
export const toSandboxApp = (example: string) => `import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HorizontalList, PickersProvider } from '${PACKAGE}';

import ${example} from './${example}';

const platforms = [
  { label: 'iOS', value: 'ios', icon: <Text>🍎</Text> },
  { label: 'Android', value: 'android', icon: <Text>🤖</Text> },
  { label: 'Web', value: 'web', icon: <Text>🌐</Text> },
] as const;

export default function App() {
  const [platform, setPlatform] = useState(Platform.OS);
  return (
    <PickersProvider platform={platform}>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.example}>
          <${example} />
        </View>
      </ScrollView>
      <HorizontalList items={platforms} value={platform} onChange={setPlatform} style={styles.platforms} />
    </PickersProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, alignItems: 'center', padding: 20, paddingTop: 56, paddingBottom: 96 },
  example: { width: '100%', maxWidth: 400, gap: 8 },
  platforms: { position: 'absolute', right: 16, bottom: 24 },
});
`;

const VITE_CONFIG = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The pickers import react-native; on the web that's react-native-web.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { 'react-native': 'react-native-web' } },
});
`;

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${SANDBOX_TITLE}</title>
    <!-- react-native-web's animations call global.requestAnimationFrame, and Vite, unlike Metro and webpack, doesn't define global. -->
    <script>globalThis.global = globalThis;</script>
    <style>
      html, body, #root { height: 100%; margin: 0; }
      #root { display: flex; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const MAIN = `import { createRoot } from 'react-dom/client';

import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
`;

/** The Vite + react-native-web files around an example and the App that renders it. `.npmrc`: the pickers' react-native peer is served by react-native-web, so npm mustn't install it. */
export const WEB_TEMPLATE_FILES = {
  '.npmrc': 'legacy-peer-deps=true\n',
  'vite.config.ts': VITE_CONFIG,
  'index.html': INDEX_HTML,
  'src/main.tsx': MAIN,
};
