import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CodeBlock from '@theme/CodeBlock';
import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';
import styles from './index.module.css';

const INSTALL = 'npm install @elik56a/react-native-pickers';

const FEATURES = [
  { icon: '🧩', title: 'Zero native code', body: 'Pure JavaScript. Runs in Expo Go, bare React Native and React Native Web with no pod install or rebuild.' },
  { icon: '🎨', title: 'Themeable to the pixel', body: 'Design tokens, automatic dark mode, a typed style slot for every part, and render props when you need full control.' },
  { icon: '📅', title: 'Ranges, built in', body: 'Single, range and multiple date selection with min/max nights, disabled days, prices and dots, all with no marking logic to write.' },
  { icon: '🌍', title: 'Any locale, RTL', body: 'Month, weekday and AM/PM names, the 12/24h clock, week start and date order all come from Intl. Layouts mirror for RTL.' },
  { icon: '♿️', title: 'Accessible', body: 'Adjustable wheels for VoiceOver and TalkBack, fully labelled days, and selected and disabled states everywhere.' },
  { icon: '⚡️', title: 'Fast', body: 'Native-driver animations, virtualized fixed-layout lists and memoized rows keep it at 60 fps.' },
];

const COMPONENTS = [
  { to: '/docs/components/wheel-picker', name: 'WheelPicker', body: '3D wheel, loop, disabled rows, tap-to-type' },
  { to: '/docs/components/time-picker', name: 'TimePicker', body: '12/24h from locale, intervals, min/max' },
  { to: '/docs/components/date-picker', name: 'DatePicker', body: 'Calendar or wheel, marked dates, i18n' },
  { to: '/docs/components/date-range-picker', name: 'Date range', body: 'Check-in/out, min/max nights, multiple' },
  { to: '/docs/components/select-picker', name: 'SelectPicker', body: 'Search, groups, icons, multi-select chips' },
  { to: '/docs/components/emoji-picker', name: 'EmojiPicker', body: '1,906 emojis, skin tones, recents, search' },
  { to: '/docs/components/multi-wheel-picker', name: 'MultiWheelPicker', body: 'Durations, units, dependent columns' },
  { to: '/docs/components/picker-sheets', name: 'Sheets', body: 'Every picker in a bottom sheet with Done' },
];

const SAMPLE = `import { DatePicker, DatePickerSheet } from '@elik56a/react-native-pickers';

// inline calendar
<DatePicker value={date} onChange={setDate} minDate={new Date()} />

// range in a bottom sheet: commits on Done
<DatePickerSheet
  visible={open}
  onClose={() => setOpen(false)}
  mode="range"
  value={range}
  onConfirm={setRange}
/>`;

function CopyInstall() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.install}
      onClick={() => {
        navigator.clipboard?.writeText(INSTALL);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label="Copy install command"
    >
      <span className={styles.prompt}>$</span>
      <code>{INSTALL}</code>
      <span className={styles.copy}>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function Showcase() {
  const { colorMode } = useColorMode();
  return (
    <BrowserOnly fallback={<div className={styles.phoneScreen} />}>
      {() => {
        const Demo = require('../components/HeroDemo').default as React.ComponentType<{ colorMode: 'light' | 'dark' }>;
        return <Demo colorMode={colorMode} />;
      }}
    </BrowserOnly>
  );
}

export default function Home() {
  return (
    <Layout
      title="Pure-JS pickers for React Native"
      description="Wheel, time, date, calendar, range, select and emoji pickers for React Native, with bottom sheets. 100% JavaScript, zero native code. Expo Go, bare RN and React Native Web."
    >
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.heroText}>
            <span className={styles.badge}>Expo Go · iOS · Android · Web</span>
            <h1 className={styles.title}>
              Every picker your
              <br />
              <span className="gradient-text">React Native</span> app needs.
            </h1>
            <p className={styles.subtitle}>
              Wheel, time, date, range, select and emoji pickers, plus the bottom sheets to put them in. Beautiful by default, themeable to the pixel,
              and <strong>100% JavaScript</strong> with zero native code.
            </p>
            <CopyInstall />
            <div className={styles.ctas}>
              <Link className="button button--primary button--lg" to="/docs/getting-started/quick-start">
                Get started →
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/intro">
                Why this library
              </Link>
            </div>
          </div>
          <div className={styles.phone}>
            <div className={styles.phoneNotch} />
            <Showcase />
          </div>
        </div>
      </header>

      <main>
        <section className={clsx('container', styles.section)}>
          <h2 className={styles.h2}>One package. One API. Every picker.</h2>
          <div className={styles.components}>
            {COMPONENTS.map((c) => (
              <Link key={c.name} to={c.to} className={styles.componentCard}>
                <strong>{c.name}</strong>
                <span>{c.body}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={clsx('container', styles.section)}>
          <div className={styles.features}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.feature}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={clsx('container', styles.section, styles.split)}>
          <div>
            <h2 className={styles.h2Left}>Feels native. Isn&apos;t.</h2>
            <p className={styles.lead}>
              The same <code>value</code> / <code>onChange</code> API everywhere, typed down to the selection mode. Sheets keep a draft and commit on
              Done, just like the system pickers, but they match your design on every platform.
            </p>
            <ul className={styles.checks}>
              <li>Controlled or uncontrolled</li>
              <li>Light and dark themes that follow the OS</li>
              <li>No Reanimated, Gesture Handler or SVG</li>
              <li>Full TypeScript types</li>
            </ul>
            <Link to="/docs/getting-started/core-concepts">Core concepts →</Link>
          </div>
          <CodeBlock language="tsx">{SAMPLE}</CodeBlock>
        </section>

        <section className={clsx('container', styles.section, styles.ai)}>
          <h2 className={styles.h2}>Docs your AI can read, too</h2>
          <p className={styles.lead}>
            The whole API is available as <Link to="pathname:///llms.txt">llms.txt</Link> and{' '}
            <Link to="pathname:///llms-full.txt">llms-full.txt</Link>. Drop it into Cursor, Claude or Copilot and get correct code on the first try.
          </p>
        </section>
      </main>
    </Layout>
  );
}
