import { useRef } from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';

import { CodeTape } from '../hero/components/CodeTape';
import { SpecStage } from '../hero/components/SpecStage';
import type { WordWheel } from '../hero/components/WordWheel';
import { HERO_STACKED_QUERY, HERO_WHEEL_ITEMS, HERO_WHEEL_SIZE, HERO_WIDE_QUERY } from '../hero/hero.constants';
import { useHero } from '../hero/hooks/useHero';
import { usePointerTilt } from '../hero/hooks/usePointerTilt';
import { useWheelDrag } from '../hero/hooks/useWheelDrag';
import { PACKAGE } from '../home.constants';
import shared from '../home.module.css';
import { revealDelay } from '../home.utils';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { CopyInstall } from './CopyInstall';
import styles from './Hero.module.css';
import { Stats } from './Stats';
import { StepArrow } from './StepArrow';

export const Hero = () => {
  const { version } = useDocusaurusContext().siteConfig.customFields as { version: string };
  const { colorMode } = useColorMode();
  const logo = useBaseUrl('/img/logo.svg');
  const heroRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLSpanElement>(null);
  const wheelRef = useRef<HTMLSpanElement>(null);
  const hero = useHero(heroRef, bandRef);
  const wide = useMediaQuery(HERO_WIDE_QUERY);
  const stacked = useMediaQuery(HERO_STACKED_QUERY);
  usePointerTilt(heroRef);
  useWheelDrag(wheelRef, (wide ? HERO_WHEEL_SIZE.wide : HERO_WHEEL_SIZE.narrow).itemHeight, hero.step);
  return (
    <header ref={heroRef} className={styles.hero}>
      <div className={clsx('container', styles.inner)}>
        {/* The navbar waits above the screen at the top of the home page, so the hero names the library itself. */}
        <p className={clsx(styles.brand, styles.reveal)}>
          <img src={logo} width={36} height={36} alt="" />
          <span>React Native Pickers</span>
          <span className={styles.version}>v{version}</span>
        </p>
        {/* The headline holds the wheel and its step buttons, so the heading is this sentence rather than its controls. */}
        <h1 className={shared.srOnly}>Every picker your React Native app needs, native on iOS, Android and the web</h1>
        <div className={styles.top}>
          <div className={clsx(styles.title, styles.reveal)} style={revealDelay(1)}>
            <span aria-hidden>Every</span>
            <span ref={bandRef} className={styles.band}>
              <span ref={wheelRef} className={styles.wheelSlot}>
                <span className={styles.wheelWidth} aria-hidden>
                  {HERO_WHEEL_ITEMS.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </span>
                <BrowserOnly
                  fallback={
                    <span className={styles.wheelFallback} aria-hidden>
                      {hero.word}
                    </span>
                  }
                >
                  {() => {
                    // react-native-web touches `window` on import, so the wheel only loads in the browser.
                    const { WordWheel: Wheel } = require('../hero/components/WordWheel') as { WordWheel: typeof WordWheel };
                    return (
                      <span className={styles.wheel}>
                        <Wheel value={hero.word} onChange={hero.pick} wide={wide} centered={stacked} colorMode={colorMode} />
                      </span>
                    );
                  }}
                </BrowserOnly>
              </span>
              <span className={styles.steps}>
                <StepArrow direction="up" label="Previous picker" onPress={() => hero.step(-1)} />
                <StepArrow direction="down" label="Next picker" onPress={() => hero.step(1)} />
              </span>
            </span>
            <span aria-hidden>picker</span>
          </div>
          <div className={clsx(styles.aside, styles.reveal)} style={revealDelay(2)}>
            <p className={styles.subtitle}>One line of code, and each device draws the picker its own platform’s way.</p>
            <CopyInstall />
            <div className={styles.ctas}>
              <Link className="button button--primary button--lg" to="/docs/getting-started/quick-start">
                Get started
              </Link>
              <Link className={clsx('button button--lg', shared.ghostButton)} to="/docs/intro">
                Why this library
              </Link>
            </div>
          </div>
        </div>
        <SpecStage spec={hero.spec} wide={wide} values={hero.values} set={hero.set} />
        <CodeTape spec={hero.spec} values={hero.values} />
        <div className={clsx(styles.footer, styles.reveal)} style={revealDelay(3)}>
          <Stats />
          <p className={styles.specLine}>
            <span>{PACKAGE}</span>
            <span>iOS · Web · Android · Expo Go</span>
          </p>
        </div>
      </div>
    </header>
  );
};
