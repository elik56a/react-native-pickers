import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { CLOCK_MODE } from '../time.constants';
import { styles } from '../time.styles';
import type { ClockPartProps } from '../time.types';
import { ClockField } from './ClockField';

/** The chosen time in large type, to point the dial at the hours or minutes or to type them; AM/PM beside them on a 12h clock. */
export const ClockHeader = ({ dial, theme, testID }: ClockPartProps) => {
  const c = theme.colors;
  const period = (pm: boolean) => {
    const active = dial.isPM === pm;
    return (
      <Touchable
        theme={theme}
        onPress={() => dial.selectPeriod(pm)}
        accessibilityRole="radio"
        accessibilityState={{ checked: active }}
        style={[styles.periodHalf, { backgroundColor: active ? c.primaryMuted : 'transparent' }]}
      >
        <Text style={[textStyle(theme, 'sm', 'medium'), { color: active ? c.primary : c.textSecondary }]}>{dial.periods[pm ? 1 : 0]}</Text>
      </Touchable>
    );
  };

  return (
    <View style={[styles.header, dial.typing && styles.headerTop, { gap: theme.spacing.sm }]}>
      <ClockField field={CLOCK_MODE.hour} dial={dial} theme={theme} testID={testID} />
      <Text style={[textStyle(theme, 'xl'), styles.fieldText]}>:</Text>
      <ClockField field={CLOCK_MODE.minute} dial={dial} theme={theme} testID={testID} />
      {dial.is12 ? (
        <View
          accessibilityRole="radiogroup"
          style={[styles.period, { marginStart: theme.spacing.sm, borderColor: c.textSecondary, borderRadius: theme.radius.sm }]}
        >
          {period(false)}
          {period(true)}
        </View>
      ) : null}
    </View>
  );
};
