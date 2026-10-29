import { Pressable, Text } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { styles } from '../example.styles';

export const Button = ({ title, onPress }: { title: string; onPress: () => void }) => {
  const { colors } = usePickerTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={[styles.buttonText, { color: colors.onPrimary }]}>{title}</Text>
    </Pressable>
  );
};
