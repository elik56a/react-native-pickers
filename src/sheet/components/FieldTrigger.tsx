import { StyleSheet, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { DISABLED_TRIGGER_OPACITY, FIELD_DESIGN, FIELD_LABEL, FLOATING_LABEL_PADDING, FOCUS_RING_WIDTH } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FieldTriggerProps } from '../sheet.types';
import { getFieldAccessibility } from '../sheet.utils';
import { Chevron } from './Chevron';
import { FloatingLabel } from './FloatingLabel';

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
  error,
  required,
  onOpen,
  onClear,
  renderChevron,
  theme,
  slots,
  testID,
}: FieldTriggerProps) => {
  const c = theme.colors;
  const look = FIELD_DESIGN[theme.design];
  const borderWidth = open ? look.openBorderWidth : 1;
  const floating = look.label === FIELD_LABEL.floating && !!label;
  const raised = open || !!displayValue || children != null;
  const invalid = !!error;

  return (
    <View
      testID={testID}
      style={[
        styles.trigger,
        {
          minHeight: look.minHeight,
          backgroundColor: c.background,
          borderWidth,
          borderColor: invalid ? c.danger : open ? c.primary : c[look.outline],
          borderRadius: theme.radius.md,
          // A thicker open border grows inward, so the content doesn't shift.
          paddingHorizontal: theme.spacing.md - (borderWidth - 1),
          opacity: disabled ? DISABLED_TRIGGER_OPACITY : 1,
        },
        open && look.focusRing && { boxShadow: `0px 0px 0px ${FOCUS_RING_WIDTH}px ${c.primaryMuted}` },
        slots?.trigger,
      ]}
    >
      {floating ? (
        <FloatingLabel
          label={label}
          raised={raised}
          open={open}
          invalid={invalid}
          required={required}
          borderWidth={borderWidth}
          theme={theme}
          style={[{ marginStart: theme.spacing.md - FLOATING_LABEL_PADDING - (borderWidth - 1) }, slots?.label]}
        />
      ) : null}
      {/* Full-size press target behind the content, so chips and clear stay sibling buttons */}
      <Touchable
        theme={theme}
        ripple={false}
        style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.md }]}
        onPress={onOpen}
        disabled={disabled}
        accessibilityRole="button"
        {...getFieldAccessibility({ name: label ?? placeholder, value: displayValue, error, required })}
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
              {floating && !raised ? '' : placeholder}
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
