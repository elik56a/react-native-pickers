import { View } from 'react-native';

import { KEY } from '../../core/core.constants';
import { keyboardProps } from '../../core/utils/keyboard.utils';
import { COLOR_A11Y_ACTIONS, COLOR_STEP, PAD_ACTION } from '../color.constants';
import { styles } from '../color.styles';
import type { ColorPadProps } from '../color.types';
import { clamp01 } from '../color.utils';
import { useTrackPan } from '../hooks/useTrackPan';

/**
 * A square of colour to tap or drag across. Screen readers step it across with increment and decrement, and up and down
 * with two named actions, since they can't move in two directions at once.
 */
export const ColorPad = ({
  label,
  x,
  y,
  onChange,
  thumbColor,
  valueText,
  upLabel,
  downLabel,
  height,
  children,
  theme,
  slots,
  testID,
}: ColorPadProps) => {
  const pan = useTrackPan(onChange);
  const moveX = (by: number) => onChange(clamp01(x + by), y);
  const moveY = (by: number) => onChange(x, clamp01(y + by));
  return (
    <View
      style={[styles.pad, { height, borderRadius: theme.radius.md }, slots?.pad]}
      onLayout={pan.onLayout}
      {...pan.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: valueText }}
      accessibilityActions={[...COLOR_A11Y_ACTIONS, { name: PAD_ACTION.up, label: upLabel }, { name: PAD_ACTION.down, label: downLabel }]}
      onAccessibilityAction={({ nativeEvent: { actionName } }) => {
        if (actionName === 'increment' || actionName === 'decrement') moveX(actionName === 'increment' ? COLOR_STEP : -COLOR_STEP);
        else moveY(actionName === PAD_ACTION.up ? -COLOR_STEP : COLOR_STEP);
      }}
      {...keyboardProps({
        [KEY.right]: () => moveX(COLOR_STEP),
        [KEY.left]: () => moveX(-COLOR_STEP),
        [KEY.up]: () => moveY(-COLOR_STEP),
        [KEY.down]: () => moveY(COLOR_STEP),
      })}
      testID={testID}
    >
      <View pointerEvents="none" style={styles.layer}>
        {children}
      </View>
      <View pointerEvents="none" style={[styles.padThumb, { left: `${x * 100}%`, top: `${y * 100}%`, backgroundColor: thumbColor }]} />
    </View>
  );
};
