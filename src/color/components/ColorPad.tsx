import { View } from 'react-native';

import { A11Y_ACTION, ADJUSTABLE_ACTIONS, KEY } from '../../core/core.constants';
import { useTrackPan } from '../../core/hooks/useTrackPan';
import { keyboardProps } from '../../core/utils/keyboard.utils';
import { clamp01 } from '../../core/utils/track.utils';
import { COLOR_STEP, PAD_ACTION } from '../color.constants';
import { styles } from '../color.styles';
import type { ColorPadProps } from '../color.types';

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
  const pan = useTrackPan({ onMove: onChange });
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
      accessibilityActions={[...ADJUSTABLE_ACTIONS, { name: PAD_ACTION.up, label: upLabel }, { name: PAD_ACTION.down, label: downLabel }]}
      onAccessibilityAction={({ nativeEvent: { actionName } }) => {
        if (actionName === A11Y_ACTION.increment || actionName === A11Y_ACTION.decrement) {
          moveX(actionName === A11Y_ACTION.increment ? COLOR_STEP : -COLOR_STEP);
        } else moveY(actionName === PAD_ACTION.up ? -COLOR_STEP : COLOR_STEP);
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
