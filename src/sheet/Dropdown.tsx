import { Animated, Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { usePickerTheme } from '../core';
import { usePresence } from '../core/hooks/usePresence';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { DROPDOWN_MAX_HEIGHT } from './sheet.constants';
import { styles } from './sheet.styles';
import type { DropdownProps } from './sheet.types';
import { getDropdownFrame } from './sheet.utils';

/** A popover anchored to a field; a tap outside closes it. It fades out, so a row's ripple can finish as it closes. */
export const Dropdown = ({
  visible,
  anchor,
  onClose,
  children,
  overlay,
  maxHeight = DROPDOWN_MAX_HEIGHT,
  minWidth,
  theme: themeProp,
  design,
  testID,
}: DropdownProps) => {
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const windowSize = useWindowDimensions();
  const { mounted, progress } = usePresence({ visible, duration: theme.animation.duration });
  if (!mounted || !anchor) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} testID={testID}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        disabled={!visible}
        accessibilityRole="button"
        accessibilityLabel="Close"
      />
      {overlay ? (
        <Animated.View
          style={[
            styles.dropdownOverlay,
            { opacity: progress },
            {
              left: anchor.x,
              top: anchor.y,
              width: anchor.width,
              height: anchor.height,
            },
          ]}
        >
          {overlay}
        </Animated.View>
      ) : null}
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[
          styles.dropdown,
          { opacity: progress },
          getDropdownFrame(anchor, windowSize, maxHeight, minWidth),
          {
            backgroundColor: theme.colors.sheet,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            boxShadow: `0px 8px 24px ${theme.colors.backdrop}`,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};
