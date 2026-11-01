import { Pressable, Text } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { styles } from '../demo.styles';

interface NextButtonProps {
  label: string;
  onPress: () => void;
}

/** The primary button for a step that isn't the last, styled like the Reserve button that ends the booking. */
export const NextButton = ({ label, onPress }: NextButtonProps) => {
  const { colors, radius } = usePickerTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.primaryButton, { backgroundColor: colors.primary, borderRadius: radius.lg }]}
    >
      <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>{label}</Text>
    </Pressable>
  );
};
