import { TextInput, View } from 'react-native';
import { NUMERIC_KEYBOARD_TYPE } from '../wheel.constants';
import { styles } from '../wheel.styles';
import type { WheelTypingInputProps } from '../wheel.types';

export const WheelTypingInput = ({
  value,
  numeric,
  itemHeight,
  theme,
  accessibilityLabel,
  onChangeText,
  onDone,
}: WheelTypingInputProps) => (
  <>
    <View pointerEvents="none" style={styles.centerOverlay}>
      <View
        style={[
          styles.typingRing,
          { height: itemHeight, borderRadius: theme.radius.md, borderColor: theme.colors.primary, marginHorizontal: theme.spacing.xs },
        ]}
      />
    </View>
    <TextInput
      autoFocus
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onDone}
      onBlur={onDone}
      keyboardType={numeric ? NUMERIC_KEYBOARD_TYPE : 'default'}
      returnKeyType="done"
      autoCorrect={false}
      autoCapitalize="none"
      caretHidden
      style={styles.hiddenInput}
      accessibilityLabel={accessibilityLabel}
    />
  </>
);
