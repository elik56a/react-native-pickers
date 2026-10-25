import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import type { SlotStyles, ThemableProps } from '../core';
import { textStyle, usePickerTheme } from '../core';

export type BottomSheetSlot = 'backdrop' | 'sheet' | 'handle' | 'header' | 'title' | 'content' | 'footer';

export interface BottomSheetProps extends ThemableProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  /** Rendered on the right side of the header (e.g. a Done button) */
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  footer?: React.ReactNode;
  /** Drag the sheet down to dismiss. Default: true */
  enableSwipeToClose?: boolean;
  /** Tap the backdrop to dismiss. Default: true */
  closeOnBackdropPress?: boolean;
  /** Max sheet height as a fraction of the window. Default: 0.9 */
  maxHeightRatio?: number;
  /** Fixed sheet height (px or fraction of the window when <= 1) */
  height?: number;
  /** Extra bottom padding for home indicators. Default: 24 on iOS, 12 elsewhere */
  bottomInset?: number;
  styles?: SlotStyles<BottomSheetSlot>;
  onOpened?: () => void;
  onClosed?: () => void;
  testID?: string;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  title,
  headerLeft,
  headerRight,
  footer,
  enableSwipeToClose = true,
  closeOnBackdropPress = true,
  maxHeightRatio = 0.9,
  height,
  bottomInset = Platform.OS === 'ios' ? 24 : 12,
  styles: slots,
  theme: themeOverride,
  onOpened,
  onClosed,
  testID,
}: BottomSheetProps) {
  const theme = usePickerTheme(themeOverride);
  const { height: windowHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current; // 0 hidden, 1 shown
  const drag = useRef(new Animated.Value(0)).current;
  const sheetHeight = useRef(windowHeight);
  const native = Platform.OS !== 'web';

  useEffect(() => {
    if (visible) {
      setMounted(true);
      drag.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: theme.animation.duration + 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: native,
      }).start(({ finished }) => finished && onOpened?.());
    } else if (mounted) {
      Animated.timing(progress, {
        toValue: 0,
        duration: theme.animation.duration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: native,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          onClosed?.();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => enableSwipeToClose && g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => drag.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > Math.min(140, sheetHeight.current * 0.3) || g.vy > 0.9) {
          closeRef.current();
        } else {
          Animated.spring(drag, { toValue: 0, useNativeDriver: native, bounciness: 4 }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(drag, { toValue: 0, useNativeDriver: native }).start();
      },
    })
  ).current;

  const onLayout = useCallback((e: { nativeEvent: { layout: { height: number } } }) => {
    sheetHeight.current = e.nativeEvent.layout.height;
  }, []);

  if (!mounted) return null;

  const translateY = Animated.add(progress.interpolate({ inputRange: [0, 1], outputRange: [windowHeight, 0] }), drag);
  const resolvedHeight = height === undefined ? undefined : height <= 1 ? windowHeight * height : height;

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
        <View style={s.container} pointerEvents="box-none">
          <Animated.View
            onLayout={onLayout}
            style={[
              s.sheet,
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
            <View {...pan.panHandlers}>
              <View style={s.handleArea}>
                <View style={[s.handle, { backgroundColor: theme.colors.handle }, slots?.handle]} />
              </View>
              {(title || headerLeft || headerRight) && (
                <View style={[s.header, { paddingHorizontal: theme.spacing.lg }, slots?.header]}>
                  <View style={s.headerSide}>{headerLeft}</View>
                  <View style={s.headerCenter}>
                    {typeof title === 'string' ? (
                      <Text style={[textStyle(theme, 'md', 'bold'), slots?.title]} numberOfLines={1} accessibilityRole="header">
                        {title}
                      </Text>
                    ) : (
                      title
                    )}
                  </View>
                  <View style={[s.headerSide, s.headerRight]}>{headerRight}</View>
                </View>
              )}
            </View>
            <View style={[resolvedHeight ? s.flex : s.shrink, slots?.content]}>{children}</View>
            {footer ? (
              <View style={[{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md }, slots?.footer]}>{footer}</View>
            ) : null}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  sheet: { width: '100%', alignSelf: 'center', maxWidth: 640, overflow: 'hidden' },
  handleArea: { alignItems: 'center', paddingTop: 8, paddingBottom: 6 },
  handle: { width: 40, height: 5, borderRadius: 3 },
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingBottom: 4 },
  headerSide: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerRight: { justifyContent: 'flex-end' },
  headerCenter: { flex: 2, alignItems: 'center' },
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
});
