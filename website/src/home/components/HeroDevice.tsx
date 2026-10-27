import { useCallback, useState } from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

import type { BookingTour } from '../demo/BookingTour';
import { Device } from '../device/Device';

/** The hero's phone, running a booking app that tours itself until the visitor touches it. */
export const HeroDevice = () => {
  const { colorMode } = useColorMode();
  const [touring, setTouring] = useState(true);
  const stop = useCallback(() => setTouring(false), []);
  return (
    <Device>
      {(platform, screenHeight) => (
        <BrowserOnly fallback={null}>
          {() => {
            // react-native-web touches `window` on import, so the app only loads in the browser.
            const { BookingTour: Tour } = require('../demo/BookingTour') as { BookingTour: typeof BookingTour };
            // A fresh app per platform, so a sheet left open on one doesn't carry over.
            return (
              <Tour key={platform} colorMode={colorMode} platform={platform} screenHeight={screenHeight} touring={touring} onStop={stop} />
            );
          }}
        </BrowserOnly>
      )}
    </Device>
  );
};
