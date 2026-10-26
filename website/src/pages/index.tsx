import type React from 'react';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { useLatestVersion, useVersions } from '@docusaurus/plugin-content-docs/client';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import styles from './index.module.css';

const INSTALL = 'npm install @elik56a/react-native-pickers';

const FEATURES = [
  {
    title: 'Zero native code',
    body: 'Pure JavaScript. Runs in Expo Go, bare React Native and React Native Web with no pod install or rebuild.',
  },
  {
    title: 'Themeable to the pixel',
    body: 'Design tokens, automatic dark mode, a typed style slot for every part, and render props when you need full control.',
  },
  {
    title: 'Ranges, built in',
    body: 'Single, range and multiple date selection with min/max nights, disabled days, prices and dots, all with no marking logic to write.',
  },
  {
    title: 'Any locale, RTL',
    body: 'Month, weekday and AM/PM names, the 12/24h clock, week start and date order all come from Intl. Layouts mirror for RTL.',
  },
  {
    title: 'Accessible',
    body: 'Adjustable wheels for VoiceOver and TalkBack, fully labelled days, and selected and disabled states everywhere.',
  },
  { title: 'Fast', body: 'Native-driver animations, virtualized fixed-layout lists and memoized rows keep it at 60 fps.' },
];

const COMPONENTS = [
  { doc: 'components/wheel-picker', name: 'WheelPicker', body: '3D wheel, loop, disabled rows, tap-to-type' },
  { doc: 'components/time-picker', name: 'TimePicker', body: '12/24h from locale, intervals, min/max' },
  { doc: 'components/date-picker', name: 'DatePicker', body: 'Calendar or wheel, marked dates, i18n' },
  { doc: 'components/date-time-picker', name: 'DateTimePicker', body: 'Day + time wheel, or calendar + time' },
  { doc: 'components/date-range-picker', name: 'Date range', body: 'Check-in/out, min/max nights, multiple' },
  { doc: 'components/select-picker', name: 'SelectPicker', body: 'Search, groups, icons, multi-select chips' },
  { doc: 'components/emoji-picker', name: 'EmojiPicker', body: '1,906 emojis, skin tones, recents, search' },
  { doc: 'components/multi-wheel-picker', name: 'MultiWheelPicker', body: 'Durations, units, dependent columns' },
  { doc: 'components/picker-sheets', name: 'Sheets', body: 'Every picker in a bottom sheet with Done' },
];

const CHIPS = [
  { icon: '📦', text: 'Zero native deps' },
  { icon: '🌙', text: 'Dark mode built in' },
  { icon: '⚡', text: '60 fps wheels' },
  { icon: '🌍', text: 'Any locale, RTL' },
];

const STATS = [
  { value: COMPONENTS.length, label: 'components' },
  { value: 0, label: 'native modules' },
  { value: 1906, label: 'emojis' },
  { value: 100, suffix: '%', label: 'TypeScript' },
];

const COUNT_UP_MS = 1400;

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

const easeOut = (t: number) => 1 - (1 - t) ** 3;

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS);
      setShown(Math.round(value * easeOut(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <>
      {shown.toLocaleString('en-US')}
      {suffix}
    </>
  );
}

const PLATFORMS = [
  { key: 'ios', label: 'iOS' },
  { key: 'android', label: 'Android' },
  { key: 'web', label: 'Web' },
] as const;

type Platform = (typeof PLATFORMS)[number]['key'];

const pillAt = (index: number) => ({ '--index': index }) as React.CSSProperties;

const pinOver = (host: HTMLElement, frame: HTMLElement) => {
  const rect = frame.getBoundingClientRect();
  Object.assign(host.style, {
    position: 'absolute',
    left: `${rect.left + frame.clientLeft + window.scrollX}px`,
    top: `${rect.top + frame.clientTop + window.scrollY}px`,
    width: `${frame.clientWidth}px`,
    height: `${frame.clientHeight}px`,
    borderRadius: `${Number.parseFloat(getComputedStyle(frame).borderTopLeftRadius) - frame.clientLeft}px`,
    overflow: 'hidden',
    transform: 'translateZ(0)',
    zIndex: '1',
  });
};

/**
 * react-native-web portals every Modal into a bare <div> appended to <body>. Pinning those over the phone (the transform makes the
 * modal's `position: fixed` relative to it) opens sheets inside the device instead of over the whole page.
 */
// ponytail: the pin is measured once on open, so resizing the window while a sheet is open leaves it misplaced until it reopens
const usePortalsInside = (frameRef: RefObject<HTMLDivElement | null>, enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;
    const observer = new MutationObserver((mutations) => {
      const frame = frameRef.current;
      if (!frame) return;
      for (const node of mutations.flatMap((m) => Array.from(m.addedNodes))) {
        if (node instanceof HTMLDivElement && !node.attributes.length) pinOver(node, frame);
      }
    });
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, [frameRef, enabled]);
};

function Showcase({ platform, phoneHeight }: { platform: Platform; phoneHeight?: number }) {
  const { colorMode } = useColorMode();
  return (
    <BrowserOnly fallback={null}>
      {() => {
        const Demo = require('../components/HeroDemo').default as React.ComponentType<{
          colorMode: 'light' | 'dark';
          platform: Platform;
          phoneHeight?: number;
        }>;
        return <Demo colorMode={colorMode} platform={platform} phoneHeight={phoneHeight} />;
      }}
    </BrowserOnly>
  );
}

function StatusIcons() {
  return (
    <span className={styles.statusIcons} aria-hidden>
      <svg aria-hidden="true" width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="1" />
        <rect x="4.5" y="5" width="3" height="6" rx="1" />
        <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
        <rect x="13.5" y="0" width="3" height="11" rx="1" />
      </svg>
      <svg aria-hidden="true" width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
        <path d="M8 2.5c2.3 0 4.4.9 6 2.4l1-1A9.9 9.9 0 0 0 8 1 9.9 9.9 0 0 0 1 3.9l1 1A8.5 8.5 0 0 1 8 2.5Zm0 3c1.5 0 2.9.6 3.9 1.5l1-1A7 7 0 0 0 8 4 7 7 0 0 0 3.1 6l1 1A5.6 5.6 0 0 1 8 5.5Zm0 3c.7 0 1.3.3 1.8.7L8 11 6.2 9.2c.5-.4 1.1-.7 1.8-.7Z" />
      </svg>
      <svg aria-hidden="true" width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
        <rect x=".5" y=".5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity=".4" />
        <rect x="2" y="2" width="16" height="8" rx="1.6" />
        <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" opacity=".4" />
      </svg>
    </span>
  );
}

function Device() {
  const [platform, setPlatform] = useState<Platform>('ios');
  const frameRef = useRef<HTMLDivElement>(null);
  const [phoneHeight, setPhoneHeight] = useState<number>();
  usePortalsInside(frameRef, platform !== 'web');
  // Sheets size against the browser window; inside the mock phone they must stop at its screen.
  // biome-ignore lint/correctness/useExhaustiveDependencies: each platform has its own frame, so it's re-measured on switch
  useEffect(() => setPhoneHeight(frameRef.current?.clientHeight), [platform]);
  return (
    <div className={clsx(styles.device, platform === 'web' && styles.deviceWide)}>
      <div
        role="tablist"
        aria-label="Preview platform"
        className={styles.platformTabs}
        style={pillAt(PLATFORMS.findIndex((p) => p.key === platform))}
      >
        <span className={styles.platformPill} aria-hidden />
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={p.key === platform}
            className={styles.platformTab}
            onClick={() => setPlatform(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div ref={frameRef} className={clsx(styles.frame, styles[platform])}>
        {platform === 'web' ? (
          <div className={styles.browserBar} aria-hidden>
            <span className={styles.trafficLights}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.url}>localhost:8081</span>
          </div>
        ) : (
          <div className={styles.statusBar} aria-hidden>
            <span>9:41</span>
            <span className={styles.camera} />
            <StatusIcons />
          </div>
        )}
        <div className={styles.screen}>
          <Showcase platform={platform} phoneHeight={phoneHeight} />
        </div>
        {platform !== 'web' && <span className={styles.homeIndicator} aria-hidden />}
      </div>
    </div>
  );
}

// Components added on master but not released yet only exist in the Next docs.
const useDocPath = () => {
  const latest = useLatestVersion(undefined);
  const versions = useVersions(undefined);
  return (id: string) => [latest, ...versions].flatMap((v) => v.docs).find((doc) => doc.id === id)?.path;
};

const delay = (step: number) => ({ '--delay': `${step * 90}ms` }) as React.CSSProperties;

export default function Home() {
  const docPath = useDocPath();
  return (
    <Layout
      title="Date, Time, Wheel, Select & Emoji Pickers"
      description="Wheel, time, date, calendar, range, select and emoji pickers for React Native, with bottom sheets. 100% JavaScript, zero native code. Expo Go, bare RN and React Native Web."
    >
      <header className={styles.hero}>
        <div className={styles.aurora} aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.heroText}>
            <span className={clsx(styles.badge, styles.reveal)} style={delay(0)}>
              Expo Go · iOS · Android · Web
            </span>
            <h1 className={clsx(styles.title, styles.reveal)} style={delay(1)}>
              Every picker your
              <br />
              <span className={styles.shine}>React Native</span> app needs.
            </h1>
            <p className={clsx(styles.subtitle, styles.reveal)} style={delay(2)}>
              Wheel, time, date, range, select and emoji pickers, plus the bottom sheets to put them in. Beautiful by default, themeable to
              the pixel, and <strong>100% JavaScript</strong> with zero native code.
            </p>
            <div className={styles.reveal} style={delay(3)}>
              <CopyInstall />
            </div>
            <div className={clsx(styles.ctas, styles.reveal)} style={delay(4)}>
              <Link className={clsx('button button--primary button--lg', styles.cta)} to="/docs/getting-started/quick-start">
                Get started →
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/intro">
                Why this library
              </Link>
            </div>
            <dl className={clsx(styles.stats, styles.reveal)} style={delay(5)}>
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={styles.stageWrap}>
            {CHIPS.map((chip, i) => (
              <span key={chip.text} className={styles.chip} style={delay(6 + i * 2)} aria-hidden>
                <span>{chip.icon}</span>
                {chip.text}
              </span>
            ))}
            <Device />
          </div>
        </div>
      </header>

      <main>
        <section className={clsx('container', styles.section)}>
          <h2 className={styles.h2}>One package. One API. Every picker.</h2>
          <div className={styles.components}>
            {COMPONENTS.map((c) => (
              <Link key={c.name} to={docPath(c.doc)} className={styles.componentCard}>
                <strong>{c.name}</strong>
                <span>{c.body}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={clsx('container', styles.section)}>
          <div className={styles.features}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className={styles.feature}>
                <div className={styles.featureIndex}>{String(i + 1).padStart(2, '0')}</div>
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
              The same <code>value</code> / <code>onChange</code> API everywhere, typed down to the selection mode. Sheets keep a draft and
              commit on Done, just like the system pickers, but they match your design on every platform.
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
            <Link to="pathname:///llms-full.txt">llms-full.txt</Link>. Drop it into Cursor, Claude or Copilot and get correct code on the
            first try.
          </p>
        </section>
      </main>
    </Layout>
  );
}
