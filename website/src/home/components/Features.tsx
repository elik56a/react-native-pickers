import Link from '@docusaurus/Link';
import clsx from 'clsx';

import { FEATURES } from '../home.constants';
import shared from '../home.module.css';
import { revealAt } from '../home.utils';
import styles from './Features.module.css';

export const Features = () => (
  <section className={styles.band} aria-labelledby="features-title">
    <div className={clsx('container', styles.bandInner)}>
      <div className={styles.bandIntro} data-reveal>
        <h2 id="features-title" className={shared.h2Left}>
          Built for real apps
        </h2>
        <p className={clsx(shared.lead, shared.leadLeft)}>
          No native modules to link, no marking logic to write, and the same behavior on iOS, Android and the web.
        </p>
        <Link to="/docs/intro">Why this library →</Link>
      </div>
      <div className={styles.features}>
        {FEATURES.map((f, i) => (
          <div key={f.title} className={styles.feature} data-reveal style={revealAt(i)}>
            <div className={styles.featureIndex}>{String(i + 1).padStart(2, '0')}</div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
