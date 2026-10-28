import type { ComponentType } from 'react';

import type { ColorMode } from '@docusaurus/theme-common';

import { PickersProvider } from '@elik56a/react-native-pickers';
import { BookingScreen } from '../home/demo/components/BookingScreen';
import { AlarmScreen } from './components/AlarmScreen';
import { ChatScreen } from './components/ChatScreen';
import { FlightsScreen } from './components/FlightsScreen';
import { HabitScreen } from './components/HabitScreen';
import { MeetingScreen } from './components/MeetingScreen';
import { ShopScreen } from './components/ShopScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { TableScreen } from './components/TableScreen';
import { TimerScreen } from './components/TimerScreen';
import { TripsScreen } from './components/TripsScreen';
import type { ScreenProps, ShowcaseScreenKey } from './showcase.types';

const SCREENS: Record<ShowcaseScreenKey, ComponentType<ScreenProps>> = {
  booking: BookingScreen,
  flights: FlightsScreen,
  table: TableScreen,
  alarm: AlarmScreen,
  meeting: MeetingScreen,
  timer: TimerScreen,
  chat: ChatScreen,
  signUp: SignUpScreen,
  shop: ShopScreen,
  habit: HabitScreen,
  trips: TripsScreen,
};

interface ShowcaseAppProps extends ScreenProps {
  screen: ShowcaseScreenKey;
  colorMode: ColorMode;
}

/** One showcase app, running the real pickers in the device's design. */
export const ShowcaseApp = ({ screen, colorMode, ...props }: ShowcaseAppProps) => {
  const Screen = SCREENS[screen];
  return (
    <PickersProvider colorScheme={colorMode} platform={props.platform}>
      <Screen {...props} />
    </PickersProvider>
  );
};
