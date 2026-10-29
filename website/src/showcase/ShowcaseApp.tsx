import type { ComponentType } from 'react';

import type { PickersProviderProps } from '@elik56a/react-native-pickers';
import { PickersProvider } from '@elik56a/react-native-pickers';
import { BookingScreen } from '../home/demo/components/BookingScreen';
import { AlarmScreen } from './components/AlarmScreen';
import { AlbumsScreen } from './components/AlbumsScreen';
import { ChatScreen } from './components/ChatScreen';
import { DeliveryScreen } from './components/DeliveryScreen';
import { DisplayScreen } from './components/DisplayScreen';
import { FlightsScreen } from './components/FlightsScreen';
import { HabitScreen } from './components/HabitScreen';
import { MeetingScreen } from './components/MeetingScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { ShopScreen } from './components/ShopScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { TableScreen } from './components/TableScreen';
import { TimerScreen } from './components/TimerScreen';
import { TripsScreen } from './components/TripsScreen';
import { VerifyScreen } from './components/VerifyScreen';
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
  delivery: DeliveryScreen,
  display: DisplayScreen,
  verify: VerifyScreen,
  review: ReviewScreen,
  albums: AlbumsScreen,
};

interface ShowcaseAppProps extends ScreenProps {
  screen: ShowcaseScreenKey;
  colorMode: PickersProviderProps['colorScheme'];
  /** The look, over the platform's own; the example app switches it. */
  design?: PickersProviderProps['design'];
}

/** One showcase app, running the real pickers in the device's design. */
export const ShowcaseApp = ({ screen, colorMode, design, ...props }: ShowcaseAppProps) => {
  const Screen = SCREENS[screen];
  return (
    <PickersProvider colorScheme={colorMode} platform={props.platform} design={design}>
      <Screen {...props} />
    </PickersProvider>
  );
};
