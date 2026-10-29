import { Animated, Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { usePickerTheme } from '../core';
import { usePresence } from '../core/hooks/usePresence';
import { useReturnFocus } from '../core/hooks/useReturnFocus';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { useAnchor } from './hooks/useAnchor';
import { DROPDOWN_MAX_HEIGHT } from './sheet.constants';
import { styles } from './sheet.styles';
import type { DropdownProps } from './sheet.types';
import { getDropdownFrame, toLocalRect } from './sheet.utils';

/** A popover anchored to a field; a tap outside closes it. It fades out, so a row's ripple can finish as it closes. */
export const Dropdown = ({
  visible,
  anchor,
  onClose,
  children,
  overlay,
  maxHeight = DROPDOWN_MAX_HEIGHT,
  minWidth,
  ready = true,
  onClosed,
  style,
  theme: themeProp,
  design,
  testID,
}: DropdownProps) => {
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const windowSize = useWindowDimensions();
  const { mounted, progress } = usePresence({ visible, duration: theme.animation.duration, onHidden: onClosed });
  // In an app the modal covers the window. A page that pins modals over a smaller area, like a phone preview, moves it.
  const root = useAnchor();
  useReturnFocus(mounted);
  if (!mounted || !anchor) return null;
  const area = root.rect ?? { x: 0, y: 0, ...windowSize };
  const field = toLocalRect(anchor, area);

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} testID={testID}>
      {/* One view around the field and the list, so arrow keys go between them */}
      <View ref={root.ref} onLayout={root.measure} style={StyleSheet.absoluteFill} pointerEvents="box-none" {...ARROW_FOCUS}>
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
                left: field.x,
                top: field.y,
                width: field.width,
                height: field.height,
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
            { opacity: ready && root.rect ? progress : 0 },
            getDropdownFrame(field, area, maxHeight, minWidth),
            {
              backgroundColor: theme.colors.sheet,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              boxShadow: `0px 8px 24px ${theme.colors.backdrop}`,
            },
            style,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};
