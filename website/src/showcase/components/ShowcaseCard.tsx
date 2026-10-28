import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';

import { Device } from '../../home/device/Device';
import { PLATFORM } from '../../home/device/device.constants';
import type { Platform } from '../../home/device/device.types';
import { useDocPath } from '../../home/hooks/useDocPath';
import type { ShowcaseApp } from '../ShowcaseApp';
import styles from '../showcase.module.css';
import type { ShowcaseItem } from '../showcase.types';

export const ShowcaseCard = ({ item, platform }: { item: ShowcaseItem; platform: Platform }) => {
  const { colorMode } = useColorMode();
  const docPath = useDocPath();
  return (
    <figure className={styles.card} data-wide={platform === PLATFORM.web || undefined}>
      <Device platform={platform} rail={false}>
        {(shown, screenHeight) => (
          <BrowserOnly fallback={null}>
            {() => {
              // react-native-web touches `window` on import, so the apps only load in the browser.
              const { ShowcaseApp: App } = require('../ShowcaseApp') as { ShowcaseApp: typeof ShowcaseApp };
              // A fresh app per platform, so a sheet left open on one doesn't carry over.
              return <App key={shown} screen={item.key} colorMode={colorMode} platform={shown} screenHeight={screenHeight} />;
            }}
          </BrowserOnly>
        )}
      </Device>
      <figcaption className={styles.caption}>
        <h2 className={styles.title}>{item.title}</h2>
        <p className={styles.blurb}>{item.blurb}</p>
        <ul className={styles.components} aria-label="Components">
          {item.components.map((c) => (
            <li key={c}>
              <code>{c}</code>
            </li>
          ))}
        </ul>
        {item.recipe ? (
          <Link className={styles.recipe} to={docPath(`recipes/${item.recipe}`)}>
            Recipe →
          </Link>
        ) : null}
      </figcaption>
    </figure>
  );
};
