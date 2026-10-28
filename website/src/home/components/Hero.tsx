import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';

import { revealDelay } from '../home.utils';
import { CopyInstall } from './CopyInstall';
import styles from './Hero.module.css';
import { HeroChips } from './HeroChips';
import { LiveDevice } from './LiveDevice';
import { Stats } from './Stats';

export const Hero = () => {
  const { version } = useDocusaurusContext().siteConfig.customFields as { version: string };
  return (
    <header className={styles.hero}>
      <div className={styles.aurora} aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.heroText}>
          <span className={clsx(styles.badge, styles.reveal)} style={revealDelay(0)}>
            v{version} · Expo Go · iOS · Android · Web
          </span>
          <h1 className={clsx(styles.title, styles.reveal)} style={revealDelay(1)}>
            Every picker your
            <br />
            <span className={styles.shine}>React Native</span> app needs.
          </h1>
          <p className={clsx(styles.subtitle, styles.reveal)} style={revealDelay(2)}>
            Wheel, time, date, range, select and emoji pickers, plus the sheets and fields to put them in. Native on iOS, Android and the
            web, yours to customize, and <strong>100% JavaScript</strong> with zero native code.
          </p>
          <div className={styles.reveal} style={revealDelay(3)}>
            <CopyInstall />
          </div>
          <div className={clsx(styles.ctas, styles.reveal)} style={revealDelay(4)}>
            <Link className={clsx('button button--primary button--lg', styles.cta)} to="/docs/getting-started/quick-start">
              Get started →
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              Why this library
            </Link>
          </div>
          <div className={styles.reveal} style={revealDelay(5)}>
            <Stats />
          </div>
        </div>
        <div className={styles.stageWrap}>
          <HeroChips />
          <LiveDevice />
        </div>
      </div>
    </header>
  );
};
