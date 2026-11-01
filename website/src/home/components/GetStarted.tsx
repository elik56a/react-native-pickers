import Link from '@docusaurus/Link';
import clsx from 'clsx';

import shared from '../home.module.css';
import { CopyInstall } from './CopyInstall';
import styles from './GetStarted.module.css';

/** The page's last word: what to run, and where to go next. */
export const GetStarted = () => (
  <section className={clsx('container', shared.section, shared.split)} aria-labelledby="get-started-title">
    <div data-reveal>
      <p className={shared.eyebrow}>Install</p>
      <h2 id="get-started-title" className={shared.h2}>
        Add it in one line
      </h2>
    </div>
    <div className={styles.actions} data-reveal>
      <p className={shared.lead}>Works in Expo Go, bare React Native and React Native Web, with nothing to link or rebuild.</p>
      <CopyInstall />
      <div className={styles.buttons}>
        <Link className="button button--primary button--lg" to="/docs/getting-started/quick-start">
          Get started
        </Link>
        <Link className={clsx('button button--lg', shared.ghostButton)} to="/showcase">
          See real apps
        </Link>
      </div>
    </div>
  </section>
);
