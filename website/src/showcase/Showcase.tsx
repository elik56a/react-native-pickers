import { useState } from 'react';

import Layout from '@theme/Layout';

import { Choices } from '../components/Choices';
import { PLATFORM, PLATFORM_LABELS, PLATFORMS } from '../home/device/device.constants';
import type { Platform } from '../home/device/device.types';
import { ShowcaseCard } from './components/ShowcaseCard';
import { SHOWCASE } from './showcase.constants';
import styles from './showcase.module.css';

/** Real app screens built from the pickers, each live in a device, all switched between iOS, Android and the web together. */
export const Showcase = () => {
  const [platform, setPlatform] = useState<Platform>(PLATFORM.ios);
  return (
    <Layout title="Showcase" description="Real app screens built with React Native Pickers, live on iOS, Android and the web.">
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.h1}>Showcase</h1>
          <p className={styles.lead}>
            Real screens built from the pickers, running live. Tap any field, then switch the platform: each one takes that platform's
            design.
          </p>
          <Choices
            label="Platform"
            labels={PLATFORMS.map((p) => PLATFORM_LABELS[p])}
            selected={PLATFORMS.indexOf(platform)}
            onChoose={(i) => setPlatform(PLATFORMS[i] ?? PLATFORM.ios)}
          />
        </header>
        <div className={styles.grid} data-wide={platform === PLATFORM.web || undefined}>
          {SHOWCASE.map((item) => (
            <ShowcaseCard key={item.key} item={item} platform={platform} />
          ))}
        </div>
      </main>
    </Layout>
  );
};
