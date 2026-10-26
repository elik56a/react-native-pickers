import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

import type { DemoApp } from '../demo/DemoApp';
import { Device } from '../device/Device';
import type { Playground } from '../playground/playground.types';

/** The device mock running the real pickers through react-native-web. */
export const LiveDevice = ({ demo }: { demo: Playground }) => {
  const { colorMode } = useColorMode();
  return (
    <Device>
      {(platform, screenHeight) => (
        <BrowserOnly fallback={null}>
          {() => {
            // react-native-web touches `window` on import, so the demo only loads in the browser.
            const { DemoApp: App } = require('../demo/DemoApp') as { DemoApp: typeof DemoApp };
            return <App colorMode={colorMode} platform={platform} screenHeight={screenHeight} demo={demo} />;
          }}
        </BrowserOnly>
      )}
    </Device>
  );
};
