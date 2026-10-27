import type { ReactNode } from 'react';

import { useColorMode } from '@docusaurus/theme-common';
import { LiveProvider } from 'react-live';

import { PickersProvider } from '@elik56a/react-native-pickers';
import type { Platform } from '../../../home/device/device.types';
import { toRunnable } from '../../../live/toRunnable';
import { CODE_THEME } from '../playground.constants';

interface Props {
  code: string;
  scope?: Record<string, unknown>;
  platform: Platform;
  children: ReactNode;
}

// Examples are real files (imports + `export default function`), so readers can copy them verbatim.
export default function PlaygroundProvider({ code, scope, platform, children }: Props) {
  const { colorMode } = useColorMode();
  return (
    <PickersProvider colorScheme={colorMode} platform={platform}>
      <LiveProvider code={code} scope={scope} theme={CODE_THEME} noInline transformCode={toRunnable}>
        {children}
      </LiveProvider>
    </PickersProvider>
  );
}
