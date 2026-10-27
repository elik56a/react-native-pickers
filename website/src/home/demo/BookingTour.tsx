import { useRef } from 'react';

import { PickersProvider } from '@elik56a/react-native-pickers';
import { BookingScreen } from './components/BookingScreen';
import type { BookingAppProps } from './demo.types';
import { useBookingTour } from './hooks/useBookingTour';
import styles from './tour.module.css';

interface BookingTourProps extends BookingAppProps {
  touring: boolean;
  onStop: () => void;
}

/** The hero's booking app, played by a fingertip that taps through it until the visitor takes over. */
export const BookingTour = ({ colorMode, platform, screenHeight, touring, onStop }: BookingTourProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  useBookingTour(rootRef, touring, onStop);
  return (
    <div ref={rootRef} className={styles.root}>
      <PickersProvider colorScheme={colorMode} platform={platform}>
        <BookingScreen platform={platform} screenHeight={screenHeight} />
      </PickersProvider>
    </div>
  );
};
