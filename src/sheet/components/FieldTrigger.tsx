import { StyleSheet, View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { FIELD_DESIGN, FIELD_LABEL } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FieldTriggerProps } from '../sheet.types';
import { getFieldAccessibility, getFieldBorderWidth, getFieldBoxStyle } from '../sheet.utils';
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
  const floating = FIELD_DESIGN[theme.design].label === FIELD_LABEL.floating && !!label;
  const raised = open || !!displayValue || children != null;
  const invalid = !!error;

  return (
    <View testID={testID} style={[styles.trigger, getFieldBoxStyle(theme, { open, invalid, disabled }), slots?.trigger]}>
      {floating ? (
        <FloatingLabel
          label={label}
          raised={raised}
          open={open}
          invalid={invalid}
          required={required}
          borderWidth={getFieldBorderWidth(theme, open)}
          theme={theme}
          style={slots?.label}
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
              <PickerText theme={theme} style={[coreStyles.startAligned, slots?.triggerText]} numberOfLines={1}>
                {displayValue}
              </PickerText>
            </View>
          ) : (
            <PickerText
              theme={theme}
              color="textSecondary"
              pointerEvents="none"
              style={[coreStyles.startAligned, slots?.placeholder]}
              numberOfLines={1}
            >
              {floating && !raised ? '' : placeholder}
            </PickerText>
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
          <PickerText theme={theme} size="lg" color="textSecondary" style={[styles.clear, slots?.clear]}>
            ×
          </PickerText>
        </Touchable>
      ) : null}
      <Chevron open={open} renderChevron={renderChevron} theme={theme} style={slots?.chevron} />
    </View>
  );
};
