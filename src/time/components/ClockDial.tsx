import { View } from 'react-native';

import { useClockDial } from '../hooks/useClockDial';
import { styles } from '../time.styles';
import type { ClockDialProps } from '../time.types';
import { ClockHeader } from './ClockHeader';
import { DialFace } from './DialFace';

/** Material's time picker: the time in large type above a clock dial. Pick the hour, then the minutes. */
export const ClockDial = ({ date, onChange, options, theme, style, testID }: ClockDialProps) => {
  const dial = useClockDial(date, onChange, options);
  return (
    <View style={[styles.clock, { gap: theme.spacing.lg, paddingVertical: theme.spacing.md }, style]} testID={testID}>
      <ClockHeader dial={dial} theme={theme} testID={testID} />
      <DialFace dial={dial} theme={theme} testID={testID ? `${testID}-dial` : undefined} />
    </View>
  );
};
