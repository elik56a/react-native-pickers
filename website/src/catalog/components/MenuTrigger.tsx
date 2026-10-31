import { Text } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { styles } from '../catalog.styles';

/** The Menu playground's trigger: a tinted pill in the theme. Menu makes it pressable. */
export const MenuTrigger = () => {
  const { colors, typography } = usePickerTheme();
  return (
    <Text
      style={[styles.menuTrigger, { backgroundColor: colors.primaryMuted, color: colors.primary, fontFamily: typography.fontFamilyMedium }]}
    >
      ⋯ Options
    </Text>
  );
};
