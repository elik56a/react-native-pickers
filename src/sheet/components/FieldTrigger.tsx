import { StyleSheet, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { DISABLED_TRIGGER_OPACITY } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FieldTriggerProps } from '../sheet.types';
import { Chevron } from './Chevron';

/** The field that opens a picker: placeholder or value (or custom `children`), clear button and chevron. */
export const FieldTrigger = ({
  displayValue,
  icon,
  children,
  placeholder,
  label,
  open,
  disabled,
  clearable,
  onOpen,
  onClear,
  renderChevron,
  theme,
  slots,
  testID,
}: FieldTriggerProps) => {
  const c = theme.colors;

  return (
    <View
      testID={testID}
      style={[
        styles.trigger,
        {
          backgroundColor: c.background,
          borderColor: open ? c.primary : c.border,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
          opacity: disabled ? DISABLED_TRIGGER_OPACITY : 1,
        },
        slots?.trigger,
      ]}
    >
      {/* Full-size press target behind the content, so chips and clear stay sibling buttons */}
      <Touchable
        theme={theme}
        ripple={false}
        style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.md }]}
        onPress={onOpen}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityHint={displayValue || undefined}
        accessibilityState={{ disabled, expanded: open }}
      />
      <View style={styles.flex} pointerEvents="box-none">
        {children ??
          (displayValue ? (
            <View style={styles.triggerRow} pointerEvents="none">
              {icon ? <View style={styles.triggerIcon}>{icon}</View> : null}
              <Text style={[textStyle(theme, 'md'), coreStyles.startAligned, slots?.triggerText]} numberOfLines={1}>
                {displayValue}
              </Text>
            </View>
          ) : (
            <Text
              pointerEvents="none"
              style={[textStyle(theme, 'md'), coreStyles.startAligned, { color: c.textSecondary }, slots?.placeholder]}
              numberOfLines={1}
            >
              {placeholder}
            </Text>
          ))}
      </View>
      {clearable && displayValue && !disabled ? (
        <Touchable
          theme={theme}
          hitSlop={10}
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear"
          style={[styles.clearButton, { borderRadius: theme.radius.full }]}
        >
          <Text style={[textStyle(theme, 'lg'), styles.clear, { color: c.textSecondary }, slots?.clear]}>×</Text>
        </Touchable>
      ) : null}
      <Chevron open={open} renderChevron={renderChevron} theme={theme} style={slots?.chevron} />
    </View>
  );
};
