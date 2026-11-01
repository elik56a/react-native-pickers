import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

import type { BookingApp } from '../demo/BookingApp';
import type { BookingPlayground } from '../demo/demo.types';
import { Device } from '../device/Device';

/** The device mock running the playground's picker through react-native-web. */
export const LiveDevice = ({ playground }: { playground: BookingPlayground }) => {
  const { colorMode } = useColorMode();
  return (
    <Device>
      {(platform, screenHeight) => (
        <BrowserOnly fallback={null}>
          {() => {
            // react-native-web touches `window` on import, so the app only loads in the browser.
            const { BookingApp: App } = require('../demo/BookingApp') as { BookingApp: typeof BookingApp };
            return <App colorMode={colorMode} platform={platform} screenHeight={screenHeight} playground={playground} />;
          }}
        </BrowserOnly>
      )}
    </Device>
  );
};
