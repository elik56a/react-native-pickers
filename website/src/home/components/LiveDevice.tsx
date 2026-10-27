import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

import type { BookingApp } from '../demo/BookingApp';
import type { BookingPlayground } from '../demo/demo.types';
import { Device } from '../device/Device';

/** The device mock running the booking app on the real pickers through react-native-web, driven by the playground when given one. */
export const LiveDevice = ({ playground }: { playground?: BookingPlayground }) => {
  const { colorMode } = useColorMode();
  return (
    <Device>
      {(platform, screenHeight) => (
        <BrowserOnly fallback={null}>
          {() => {
            // react-native-web touches `window` on import, so the app only loads in the browser.
            const { BookingApp: App } = require('../demo/BookingApp') as { BookingApp: typeof BookingApp };
            // A fresh app per platform, so a sheet left open on one doesn't carry over.
            return <App key={platform} colorMode={colorMode} platform={platform} screenHeight={screenHeight} playground={playground} />;
          }}
        </BrowserOnly>
      )}
    </Device>
  );
};
