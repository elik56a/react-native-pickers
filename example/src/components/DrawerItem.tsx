import { Pressable, Text } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { DRAWER_INDENT, DRAWER_ITEM_PADDING } from '../example.constants';
import { styles } from '../example.styles';

interface DrawerItemProps {
  label: string;
  selected: boolean;
  /** 0 at the top, 1 inside a group, 2 under a page in a group */
  level: number;
  onPress: () => void;
}

export const DrawerItem = ({ label, selected, level, onPress }: DrawerItemProps) => {
  const { colors } = usePickerTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        { paddingLeft: DRAWER_ITEM_PADDING + level * DRAWER_INDENT },
        (selected || pressed) && { backgroundColor: colors.surface },
      ]}
    >
      <Text style={[styles.itemText, { color: selected ? colors.primary : colors.text }]}>{label}</Text>
    </Pressable>
  );
};
