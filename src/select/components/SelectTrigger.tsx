import { StyleSheet, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { DISABLED_TRIGGER_OPACITY } from '../select.constants';
import { styles } from '../select.styles';
import type { SelectTriggerProps } from '../select.types';
import { getSelectedLabel } from '../select.utils';
import { SelectChevron } from './SelectChevron';

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
  renderChevron,
  theme,
  slots,
}: SelectTriggerProps<T>) => {
  const c = theme.colors;
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
              <Touchable
                key={option.label}
                theme={theme}
                onPress={() => onRemove(option)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${option.label}`}
                style={[styles.chip, { backgroundColor: c.primaryMuted, borderRadius: theme.radius.full }, slots?.chip]}
              >
                <Text style={[textStyle(theme, 'sm', 'medium'), { color: c.primary }, slots?.chipText]}>{option.label} ×</Text>
              </Touchable>
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
      <SelectChevron open={open} renderChevron={renderChevron} theme={theme} style={slots?.chevron} />
    </View>
  );
};
