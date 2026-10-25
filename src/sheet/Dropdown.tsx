import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { usePickerTheme } from '../core';
import { DROPDOWN_MAX_HEIGHT } from './sheet.constants';
import { styles } from './sheet.styles';
import type { DropdownProps } from './sheet.types';
import { getDropdownFrame } from './sheet.utils';

/** A popover anchored to a field; a tap outside closes it. */
export const Dropdown = ({
  visible,
  anchor,
  onClose,
  children,
  maxHeight = DROPDOWN_MAX_HEIGHT,
  theme: themeOverride,
  testID,
}: DropdownProps) => {
  const theme = usePickerTheme(themeOverride);
  const { height: windowHeight } = useWindowDimensions();
  if (!visible || !anchor) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} testID={testID}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
      <View
        style={[
          styles.dropdown,
          getDropdownFrame(anchor, windowHeight, maxHeight),
          {
            backgroundColor: theme.colors.sheet,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            boxShadow: `0px 8px 24px ${theme.colors.backdrop}`,
          },
        ]}
      >
        {children}
      </View>
    </Modal>
  );
};
