import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { usePickerTheme } from '../core';
import { PLATFORM } from '../core/core.constants';
import { useReturnFocus } from '../core/hooks/useReturnFocus';
import { useDesignOverride, usePickerPlatform } from '../core/theme/ThemeProvider';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { SheetHeader } from './components/SheetHeader';
import { useSheetAnimation } from './hooks/useSheetAnimation';
import { useSheetResize } from './hooks/useSheetResize';
import { DEFAULT_MAX_HEIGHT_RATIO, DIALOG_RISE, SHEET_PRESENTATION } from './sheet.constants';
import { styles } from './sheet.styles';
import type { BottomSheetProps } from './sheet.types';
import { getSheetDefaults, resolvePresentation, resolveSheetHeight } from './sheet.utils';

export const BottomSheet = ({
  visible,
  onClose,
  children,
  title,
  headerLeft,
  headerRight,
  footer,
  enableSwipeToClose = true,
  draggable: draggableProp,
  expandable = true,
  expandedHeight,
  showHandle = true,
  closeOnBackdropPress = true,
  maxHeightRatio = DEFAULT_MAX_HEIGHT_RATIO,
  height,
  bottomInset: bottomInsetProp,
  presentation = SHEET_PRESENTATION.auto,
  styles: slots,
  theme: themeProp,
  design,
  onOpened,
  onClosed,
  testID,
}: BottomSheetProps) => {
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const platform = usePickerPlatform();
  const defaults = getSheetDefaults(platform);
  const draggable = draggableProp ?? defaults.draggable;
  const bottomInset = bottomInsetProp ?? defaults.bottomInset;
  const dialog = resolvePresentation(presentation, platform, windowWidth) === SHEET_PRESENTATION.modal;
  const { mounted, progress, drag, translateY } = useSheetAnimation({
    visible,
    duration: theme.animation.duration,
    slideDistance: dialog ? DIALOG_RISE : windowHeight,
    onOpened,
    onClosed,
  });
  const expandedPx = resolveSheetHeight(expandedHeight, windowHeight) ?? windowHeight - defaults.expandedTopInset;
  const resize = useSheetResize({
    active: mounted && visible,
    drag,
    draggable: !dialog,
    expandable: expandable && !dialog,
    swipeToClose: enableSwipeToClose && !dialog,
    expandedHeight: expandedPx,
    duration: theme.animation.duration,
    onClose,
  });
  const radius = theme.radius.sheet;
  useReturnFocus(mounted);

  if (!mounted) return null;
  const resolvedHeight = resolveSheetHeight(height, windowHeight);

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose} testID={testID}>
      <KeyboardAvoidingView behavior={Platform.OS === PLATFORM.ios ? 'padding' : undefined} style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.backdrop, opacity: progress }, slots?.backdrop]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeOnBackdropPress ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
        </Animated.View>
        <View style={dialog ? styles.dialogContainer : styles.container} pointerEvents="box-none">
          {/* Two layers: the slide runs on the native driver, the height can't, and one view can't mix both */}
          <Animated.View style={[styles.sheetFrame, { transform: [{ translateY }] }, dialog && { opacity: progress }]}>
            <Animated.View
              ref={resize.sheetRef}
              {...ARROW_FOCUS}
              onLayout={resize.onLayout}
              style={[
                styles.sheet,
                {
                  backgroundColor: theme.colors.sheet,
                  maxHeight: resize.sized ? expandedPx : windowHeight * maxHeightRatio,
                  height: resize.sized ? resize.height : resolvedHeight,
                },
                dialog
                  ? { borderRadius: radius, paddingBottom: theme.spacing.md }
                  : { borderTopLeftRadius: radius, borderTopRightRadius: radius, paddingBottom: bottomInset },
                slots?.sheet,
              ]}
              accessibilityViewIsModal
            >
              {/* collapsable={false}: not flattened away, so a touch anywhere on the strip reaches the drag handlers */}
              <View style={dialog && styles.dialogHeader}>
                {!dialog && showHandle && (
                  <View {...resize.panHandlers} collapsable={false} style={styles.handleArea}>
                    <View style={[styles.handle, { backgroundColor: theme.colors.handle }, slots?.handle]} />
                  </View>
                )}
                {(title || headerLeft || headerRight) && (
                  <View {...(draggable && !dialog ? resize.panHandlers : null)} collapsable={false}>
                    <SheetHeader title={title} headerLeft={headerLeft} headerRight={headerRight} theme={theme} slots={slots} />
                  </View>
                )}
              </View>
              <View style={[resolvedHeight || resize.sized ? styles.flex : styles.shrink, slots?.content]}>{children}</View>
              {footer ? (
                <View style={[{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md }, slots?.footer]}>{footer}</View>
              ) : null}
            </Animated.View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
