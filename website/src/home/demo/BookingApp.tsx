import { PickersProvider } from '@elik56a/react-native-pickers';
import { BookingScreen } from './components/BookingScreen';
import type { BookingAppProps } from './demo.types';

/** The booking app running inside the mock device, with that device's design, themed with the accent picked in the props panel. */
export const BookingApp = ({ colorMode, ...screen }: BookingAppProps) => {
  const accent = screen.playground?.accent.theme;
  return (
    <PickersProvider
      colorScheme={colorMode}
      theme={accent ? { colors: accent.light } : undefined}
      darkTheme={accent ? { colors: accent.dark } : undefined}
      platform={screen.platform}
    >
      <BookingScreen {...screen} />
    </PickersProvider>
  );
};
