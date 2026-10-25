import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { coreStyles } from '../../core/core.styles';
import { DISABLED_TRIGGER_OPACITY, PRESSED_TRIGGER_OPACITY } from '../select.constants';
import { styles } from '../select.styles';
import type { SelectTriggerProps } from '../select.types';
import { getSelectedLabel } from '../select.utils';

/** The field that opens the sheet: placeholder, selected label or removable chips, clear button and chevron. */
export const SelectTrigger = <T,>({
  selected,
  multiple,
  chips,
  placeholder,
  label,
  open,
  disabled,
  clearable,
  onOpen,
  onRemove,
  onClear,
  theme,
  slots,
}: SelectTriggerProps<T>) => {
  const c = theme.colors;
  const [pressed, setPressed] = useState(false);
  const first = selected[0];

  return (
    <View
      style={[
        styles.trigger,
        {
          backgroundColor: c.background,
          borderColor: open ? c.primary : c.border,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
          opacity: disabled ? DISABLED_TRIGGER_OPACITY : pressed ? PRESSED_TRIGGER_OPACITY : 1,
        },
        slots?.trigger,
      ]}
    >
      {/* Full-size press target behind the content, so chips and clear stay sibling buttons */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onOpen}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityHint={getSelectedLabel(selected) || undefined}
        accessibilityState={{ disabled, expanded: open }}
      />
      <View style={styles.flex} pointerEvents="box-none">
        {selected.length === 0 ? (
          <Text
            pointerEvents="none"
            style={[textStyle(theme, 'md'), coreStyles.startAligned, { color: c.textSecondary }, slots?.placeholder]}
            numberOfLines={1}
          >
            {placeholder}
          </Text>
        ) : multiple && chips ? (
          <View style={styles.chips} pointerEvents="box-none">
            {selected.map((option) => (
              <Pressable
                key={option.label}
                onPress={() => onRemove(option)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${option.label}`}
                style={[styles.chip, { backgroundColor: c.primaryMuted, borderRadius: theme.radius.full }, slots?.chip]}
              >
                <Text style={[textStyle(theme, 'sm', 'medium'), { color: c.primary }, slots?.chipText]}>{option.label} ×</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.row} pointerEvents="none">
            {!multiple && first?.icon ? <View style={styles.triggerIcon}>{first.icon}</View> : null}
            <Text style={[textStyle(theme, 'md'), coreStyles.startAligned, slots?.triggerText]} numberOfLines={1}>
              {getSelectedLabel(selected)}
            </Text>
          </View>
        )}
      </View>
      {clearable && selected.length > 0 && !disabled ? (
        <Pressable hitSlop={10} onPress={onClear} accessibilityRole="button" accessibilityLabel="Clear">
          <Text style={[textStyle(theme, 'lg'), styles.clear, { color: c.textSecondary }, slots?.clear]}>×</Text>
        </Pressable>
      ) : null}
      <Text pointerEvents="none" style={[textStyle(theme, 'sm'), styles.chevron, { color: c.textSecondary }, slots?.chevron]}>
        ▾
      </Text>
    </View>
  );
};
