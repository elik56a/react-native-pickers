import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text } from 'react-native';
import type { ThemableProps } from '../core';
import { textStyle, usePickerTheme } from '../core';
import type { BottomSheetProps } from './BottomSheet';
import { BottomSheet } from './BottomSheet';

export interface SheetChromeProps extends ThemableProps {
  visible: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  /** Default: 'Done' */
  confirmLabel?: string;
  /** Default: 'Cancel' */
  cancelLabel?: string;
  /** Show the cancel button. Default: true */
  showCancel?: boolean;
  /** Passed through to the underlying BottomSheet */
  sheetProps?: Partial<Omit<BottomSheetProps, 'visible' | 'onClose' | 'children'>>;
}

export interface PickerSheetProps extends SheetChromeProps {
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  children: React.ReactNode;
}

/** BottomSheet with Cancel / Done header buttons. */
export function PickerSheet({
  visible,
  onClose,
  onConfirm,
  confirmDisabled,
  title,
  confirmLabel = 'Done',
  cancelLabel = 'Cancel',
  showCancel = true,
  sheetProps,
  theme: themeOverride,
  children,
}: PickerSheetProps) {
  const theme = usePickerTheme(themeOverride);
  const btn = (label: string, onPress: () => void, primary: boolean, disabled?: boolean) => (
    <Pressable
      onPress={disabled ? undefined : onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 6 })}
    >
      <Text
        style={[
          textStyle(theme, 'md', primary ? 'bold' : 'regular'),
          { color: disabled ? theme.colors.textDisabled : primary ? theme.colors.primary : theme.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      theme={themeOverride}
      headerLeft={showCancel ? btn(cancelLabel, onClose, false) : undefined}
      headerRight={onConfirm ? btn(confirmLabel, onConfirm, true, confirmDisabled) : undefined}
      {...sheetProps}
    >
      {children}
    </BottomSheet>
  );
}

/** Draft state that resets to `value` every time the sheet opens. */
export function useDraft<V>(value: V, visible: boolean): [V, (v: V) => void] {
  const [draft, setDraft] = useState(value);
  const wasVisible = useRef(visible);
  useEffect(() => {
    if (visible && !wasVisible.current) setDraft(value);
    wasVisible.current = visible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  return [draft, setDraft];
}
