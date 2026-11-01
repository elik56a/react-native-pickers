import { View } from 'react-native';

import { nextField } from '../../playground/playground.utils';
import { styles } from '../demo.styles';
import type { PlaygroundScreenProps } from '../demo.types';
import { useBooking } from '../hooks/useBooking';
import { ActionButton } from './ActionButton';
import { AppScreen } from './AppScreen';
import { NextButton } from './NextButton';
import { PLAYGROUND_PICKERS } from './PlaygroundPicker';

/**
 * The booking one step at a time, each step's picker open, so every prop the panel changes shows on the phone at once. Next moves
 * to the following step and the last one reserves.
 */
export const PlaygroundScreen = ({ platform, screenHeight, playground }: PlaygroundScreenProps) => {
  const booking = useBooking(playground.options);
  const Picker = PLAYGROUND_PICKERS[playground.tab];
  const next = nextField(playground.tab);
  return (
    <AppScreen
      platform={platform}
      title={`Book a stay ${booking.vibe}`}
      subtitle={booking.summary}
      action={
        next ? (
          <NextButton label={`Next · ${next.label}`} onPress={() => playground.selectTab(next.tab)} />
        ) : (
          <ActionButton label={`Reserve · $${booking.total}`} busyLabel="Reserving…" doneLabel="✓ Reserved" disabled={!booking.nights} />
        )
      }
    >
      <View style={styles.stage}>
        <Picker booking={booking} options={playground.options} screenHeight={screenHeight} />
      </View>
    </AppScreen>
  );
};
