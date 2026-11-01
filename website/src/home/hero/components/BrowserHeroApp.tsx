import BrowserOnly from '@docusaurus/BrowserOnly';

import type { HeroApp } from '../HeroApp';
import type { HeroAppProps } from '../hero.types';

/** A hero screen, in the browser only: react-native-web touches `window` on import. */
export const BrowserHeroApp = (props: HeroAppProps) => (
  <BrowserOnly fallback={null}>
    {() => {
      const { HeroApp: App } = require('../HeroApp') as { HeroApp: typeof HeroApp };
      return <App {...props} />;
    }}
  </BrowserOnly>
);
