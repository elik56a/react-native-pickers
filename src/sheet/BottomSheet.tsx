import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { usePickerTheme } from '../core';
import { SheetHeader } from './components/SheetHeader';
import { useSheetAnimation } from './hooks/useSheetAnimation';
import { useSwipeToClose } from './hooks/useSwipeToClose';
import { DEFAULT_BOTTOM_INSET, DEFAULT_MAX_HEIGHT_RATIO } from './sheet.constants';
import { styles } from './sheet.styles';
import type { BottomSheetProps } from './sheet.types';
import { resolveSheetHeight } from './sheet.utils';

export const BottomSheet = ({
  visible,
  onClose,
  children,
  title,
  headerLeft,
  headerRight,
  footer,
  enableSwipeToClose = true,
  closeOnBackdropPress = true,
  maxHeightRatio = DEFAULT_MAX_HEIGHT_RATIO,
  height,
  bottomInset = DEFAULT_BOTTOM_INSET,
  styles: slots,
  theme: themeOverride,
  onOpened,
  onClosed,
  testID,
}: BottomSheetProps) => {
  const theme = usePickerTheme(themeOverride);
  const { height: windowHeight } = useWindowDimensions();
  const { mounted, progress, drag, translateY } = useSheetAnimation({
    visible,
    duration: theme.animation.duration,
    windowHeight,
    onOpened,
    onClosed,
  });
  const swipe = useSwipeToClose(drag, enableSwipeToClose, onClose);

  if (!mounted) return null;
  const resolvedHeight = resolveSheetHeight(height, windowHeight);

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose} testID={testID}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.backdrop, opacity: progress }, slots?.backdrop]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeOnBackdropPress ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
        </Animated.View>
        <View style={styles.container} pointerEvents="box-none">
          <Animated.View
            onLayout={swipe.onLayout}
            style={[
              styles.sheet,
              {
                backgroundColor: theme.colors.sheet,
                borderTopLeftRadius: theme.radius.sheet,
                borderTopRightRadius: theme.radius.sheet,
                maxHeight: windowHeight * maxHeightRatio,
                height: resolvedHeight,
                paddingBottom: bottomInset,
                transform: [{ translateY }],
              },
              slots?.sheet,
            ]}
            accessibilityViewIsModal
          >
            <View {...swipe.panHandlers}>
              <View style={styles.handleArea}>
                <View style={[styles.handle, { backgroundColor: theme.colors.handle }, slots?.handle]} />
              </View>
              {(title || headerLeft || headerRight) && (
                <SheetHeader title={title} headerLeft={headerLeft} headerRight={headerRight} theme={theme} slots={slots} />
              )}
            </View>
            <View style={[resolvedHeight ? styles.flex : styles.shrink, slots?.content]}>{children}</View>
            {footer ? (
              <View style={[{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md }, slots?.footer]}>{footer}</View>
            ) : null}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
