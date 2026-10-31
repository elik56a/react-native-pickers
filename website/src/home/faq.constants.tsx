import Link from '@docusaurus/Link';

import type { FaqEntry } from './home.types';

export const FAQS: FaqEntry[] = [
  {
    question: 'Does it work in Expo Go?',
    answer:
      'Yes. There is no native code, so it runs in Expo Go, dev builds, bare React Native and the web without a rebuild or a pod install.',
  },
  {
    question: 'Does it look native on iOS and Android?',
    answer: (
      <>
        Yes. Each platform gets its own design: iOS on iOS, Material Design on Android and a web design in the browser. For one look
        everywhere, set <code>design=&quot;ios&quot;</code> on <code>PickersProvider</code>. See{' '}
        <Link to="/docs/guides/platforms#designs">Designs</Link>.
      </>
    ),
  },
  {
    question: 'Can I customize the look?',
    answer: (
      <>
        Fully. Colors, radius, spacing and fonts are theme tokens with light and dark variants, every part takes a style through{' '}
        <code>styles</code>, and render props replace rows, days and triggers. Your settings always win over the design. See{' '}
        <Link to="/docs/guides/theming">Theming</Link>.
      </>
    ),
  },
  {
    question: 'Does it need Reanimated or Gesture Handler?',
    answer: (
      <>
        No. It uses only React Native core: <code>Animated</code> with the native driver, <code>PanResponder</code>, <code>FlatList</code>{' '}
        and <code>Modal</code>. Nothing to install next to it.
      </>
    ),
  },
  {
    question: 'Does it work with React Native Web?',
    answer:
      'Yes, with the same components and props, in a web design. Fields and SelectPicker open a dropdown under the field, and sheets open as a centered modal on wide windows.',
  },
  {
    question: 'Can users pick a date range or several dates?',
    answer: (
      <>
        Yes. Set <code>mode=&quot;range&quot;</code> for check-in / check-out with min and max nights, or{' '}
        <code>mode=&quot;multiple&quot;</code> for separate days. See{' '}
        <Link to="/docs/components/date-range-picker">Date range &amp; multiple</Link>.
      </>
    ),
  },
  {
    question: 'Does it work with React Hook Form, Formik or Zod?',
    answer: (
      <>
        Yes. Every picker is controlled, and every field shows your form&apos;s errors: pass the message as <code>error</code> and the field
        turns red with it underneath, with <code>helperText</code> and <code>required</code> too. See{' '}
        <Link to="/docs/guides/forms">Forms</Link>.
      </>
    ),
  },
  {
    question: 'Is it accessible?',
    answer: (
      <>
        Wheels are adjustable for VoiceOver and TalkBack, days announce their full date, and selected and disabled states are exposed
        everywhere. On the web, arrow keys move through calendars, lists and grids and step wheels and sliders. See{' '}
        <Link to="/docs/guides/accessibility">Accessibility</Link>.
      </>
    ),
  },
  {
    question: 'How big is it?',
    answer:
      'It has no dependencies. The emoji table, about 134 KB of source, is the largest part, and on the web it is tree-shaken away if you never import EmojiPicker.',
  },
];
