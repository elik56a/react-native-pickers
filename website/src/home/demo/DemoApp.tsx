import { PickersProvider } from '@elik56a/react-native-pickers';
import { DemoScreen } from './components/DemoScreen';
import type { DemoAppProps } from './demo.types';

/** The React Native app running inside the mock device, with that device's design, themed with the accent picked in the props panel. */
export const DemoApp = ({ colorMode, demo, ...screen }: DemoAppProps) => {
  const accent = demo.accent.theme;
  return (
    <PickersProvider
      colorScheme={colorMode}
      theme={accent ? { colors: accent.light } : undefined}
      darkTheme={accent ? { colors: accent.dark } : undefined}
      platform={screen.platform}
    >
      <DemoScreen demo={demo} {...screen} />
    </PickersProvider>
  );
};
