import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { CLOCK_MODE, CLOCK_MODE_LABEL } from '../time.constants';
import { styles } from '../time.styles';
import type { ClockMode, ClockPartProps } from '../time.types';

/** The chosen time in large type: tap the hours or minutes to set them on the dial; AM/PM beside them on a 12h clock. */
export const ClockHeader = ({ dial, theme, testID }: ClockPartProps) => {
  const c = theme.colors;
  const field = (mode: ClockMode, label: string) => {
    const active = dial.mode === mode;
    return (
      <Touchable
        theme={theme}
        onPress={() => dial.setMode(mode)}
        accessibilityRole="button"
        accessibilityLabel={CLOCK_MODE_LABEL[mode]}
        accessibilityValue={{ text: label }}
        accessibilityState={{ selected: active }}
        style={[styles.field, { borderRadius: theme.radius.sm, backgroundColor: active ? c.primaryMuted : c.surface }]}
        testID={testID ? `${testID}-${mode}` : undefined}
      >
        <Text style={[textStyle(theme, 'xl'), styles.fieldText, { color: active ? c.primary : c.text }]}>{label}</Text>
      </Touchable>
    );
  };
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
    <View style={[styles.header, { gap: theme.spacing.sm }]}>
      {field(CLOCK_MODE.hour, dial.hourLabel)}
      <Text style={[textStyle(theme, 'xl'), styles.fieldText]}>:</Text>
      {field(CLOCK_MODE.minute, dial.minuteLabel)}
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
