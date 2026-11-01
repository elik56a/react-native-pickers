import { Animated, StyleSheet, View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { KEY } from '../../core/core.constants';
import { keyboardProps } from '../../core/utils/keyboard.utils';
import { CLOCK_MODE_LABEL, DIAL_NUMBER_SIZE, DIAL_SIZE } from '../time.constants';
import { styles } from '../time.styles';
import type { ClockPartProps } from '../time.types';

/** The round face: numbers around it, a hand from the centre to the chosen one. Drag or tap to choose. */
export const DialFace = ({ dial, theme, testID }: ClockPartProps) => {
  const c = theme.colors;
  const radius = dial.handRadius;
  return (
    <View
      {...dial.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={CLOCK_MODE_LABEL[dial.mode]}
      accessibilityValue={{ text: dial.valueText }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => dial.step(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
      {...keyboardProps({
        [KEY.up]: () => dial.step(1),
        [KEY.right]: () => dial.step(1),
        [KEY.down]: () => dial.step(-1),
        [KEY.left]: () => dial.step(-1),
      })}
      style={[styles.dial, { backgroundColor: c.surface }]}
      testID={testID}
    >
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ rotate: dial.rotation }] }]}>
        <View style={[styles.hand, { top: DIAL_SIZE / 2 - radius, height: radius, backgroundColor: c.primary }]} />
        <View style={[styles.selector, { top: DIAL_SIZE / 2 - radius - DIAL_NUMBER_SIZE / 2, backgroundColor: c.primary }]} />
      </Animated.View>
      <View pointerEvents="none" style={[styles.center, { backgroundColor: c.primary }]} />
      {dial.numbers.map((n) => (
        <View
          key={`${n.inner ? 'inner' : 'outer'}-${n.value}`}
          pointerEvents="none"
          style={[styles.number, { left: n.x - DIAL_NUMBER_SIZE / 2, top: n.y - DIAL_NUMBER_SIZE / 2 }]}
        >
          <PickerText
            theme={theme}
            size={n.inner ? 'sm' : 'md'}
            color={n.value === dial.selected ? 'onPrimary' : n.disabled ? 'textDisabled' : 'text'}
          >
            {n.label}
          </PickerText>
        </View>
      ))}
    </View>
  );
};
