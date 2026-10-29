import { Animated, Pressable, Text } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { useAnimatedToggle } from '../../../src/core/hooks/useAnimatedToggle';
import { CARET_ROTATION } from '../example.constants';
import { styles } from '../example.styles';

interface DrawerHeaderProps {
  label: string;
  open: boolean;
  /** A top section (Components, Showcase) or a group inside one (Date & time) */
  section?: boolean;
  onPress: () => void;
}

/** A section or group title that folds what is under it, like the docs sidebar's categories. */
export const DrawerHeader = ({ label, open, section, onPress }: DrawerHeaderProps) => {
  const { colors, animation } = usePickerTheme();
  const turn = useAnimatedToggle(open, animation.duration);
  const color = section ? colors.textSecondary : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      style={[styles.drawerHeader, section ? styles.sectionHeader : styles.groupHeader]}
    >
      <Text style={[section ? styles.section : styles.group, { color }]}>{label}</Text>
      <Animated.View style={[styles.caret, { borderColor: color, transform: [{ rotate: turn.interpolate(CARET_ROTATION) }] }]} />
    </Pressable>
  );
};
