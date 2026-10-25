import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { PickerSheet } from '../sheet/PickerSheet';
import type { SheetChromeProps } from '../sheet/PickerSheet';
import { textStyle, usePickerTheme } from '../theme';
import type { SlotStyles } from '../types';
import { SelectList } from './SelectList';
import type { SelectListBaseProps, SelectOption, SelectSlot, SelectValueProps } from './SelectList';

export type SelectTriggerSlot = 'trigger' | 'triggerText' | 'placeholder' | 'label' | 'chip' | 'chipText' | 'chevron' | 'clear';

export interface SelectTriggerInfo<T> {
  open: () => void;
  selected: SelectOption<T>[];
  disabled: boolean;
}

export type SelectPickerProps<T> = Omit<SelectListBaseProps<T>, 'style' | 'styles'> &
  SelectValueProps<T> & {
    placeholder?: string;
    /** Label rendered above the field */
    label?: string;
    disabled?: boolean;
    /** Show a clear (×) button when something is selected */
    clearable?: boolean;
    onClear?: () => void;
    /** Show selected values as chips in multiple mode. Default: true */
    chips?: boolean;
    /** Single mode: close the sheet on select. Default: true */
    closeOnSelect?: boolean;
    /** Custom trigger: render anything and call `open()` */
    renderTrigger?: (info: SelectTriggerInfo<T>) => React.ReactNode;
    /** Sheet title. Default: `label` */
    sheetTitle?: string;
    sheet?: Partial<Omit<SheetChromeProps, 'visible' | 'onClose' | 'theme'>>;
    onOpen?: () => void;
    onClose?: () => void;
    style?: StyleProp<ViewStyle>;
    styles?: SlotStyles<SelectSlot | SelectTriggerSlot>;
  };

export function SelectPicker<T>(props: SelectPickerProps<T>) {
  const {
    placeholder = 'Select…',
    label,
    disabled = false,
    clearable,
    onClear,
    chips = true,
    closeOnSelect = true,
    renderTrigger,
    sheetTitle,
    sheet,
    onOpen,
    onClose,
    style,
    styles: slots,
    theme: themeOverride,
    options,
    isEqual = Object.is,
    ...listProps
  } = props;
  const theme = usePickerTheme(themeOverride);
  const c = theme.colors;
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    const vals: T[] = props.multiple ? props.value ?? [] : props.value !== undefined && props.value !== null ? [props.value] : [];
    return vals.map((v) => options.find((o) => isEqual(o.value, v))).filter((o): o is SelectOption<T> => !!o);
  }, [isEqual, options, props.multiple, props.value]);

  const show = () => {
    if (disabled) return;
    setOpen(true);
    onOpen?.();
  };
  const hide = () => {
    setOpen(false);
    onClose?.();
  };

  const onChange = props.multiple
    ? props.onChange
    : (v: T, o: SelectOption<T>) => {
        (props.onChange as ((v: T, o: SelectOption<T>) => void) | undefined)?.(v, o);
        if (closeOnSelect) hide();
      };

  const removeChip = (o: SelectOption<T>) => {
    if (!props.multiple) return;
    const next = (props.value ?? []).filter((v) => !isEqual(v, o.value));
    props.onChange?.(next, selected.filter((s) => !isEqual(s.value, o.value)));
  };

  const [pressed, setPressed] = useState(false);
  const trigger = renderTrigger ? (
    renderTrigger({ open: show, selected, disabled })
  ) : (
    <View
      style={[
        s.trigger,
        {
          backgroundColor: c.background,
          borderColor: open ? c.primary : c.border,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        slots?.trigger,
      ]}
    >
      {/* Full-size press target behind the content, so chips and clear stay sibling buttons */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={show}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityHint={selected.map((o) => o.label).join(', ') || undefined}
        accessibilityState={{ disabled, expanded: open }}
      />
      <View style={s.triggerContent} pointerEvents="box-none">
        {selected.length === 0 ? (
          <Text pointerEvents="none" style={[textStyle(theme, 'md'), { color: c.textSecondary }, slots?.placeholder]} numberOfLines={1}>
            {placeholder}
          </Text>
        ) : props.multiple && chips ? (
          <View style={s.chips} pointerEvents="box-none">
            {selected.map((o) => (
              <Pressable
                key={String(o.label)}
                onPress={() => removeChip(o)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${o.label}`}
                style={[s.chip, { backgroundColor: c.primaryMuted, borderRadius: theme.radius.full }, slots?.chip]}
              >
                <Text style={[textStyle(theme, 'sm', 'medium'), { color: c.primary }, slots?.chipText]}>{o.label}  ×</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={s.row} pointerEvents="none">
            {!props.multiple && selected[0]?.icon ? <View style={{ marginEnd: 8 }}>{selected[0].icon}</View> : null}
            <Text style={[textStyle(theme, 'md'), slots?.triggerText]} numberOfLines={1}>
              {selected.map((o) => o.label).join(', ')}
            </Text>
          </View>
        )}
      </View>
      {clearable && selected.length > 0 && !disabled ? (
        <Pressable
          hitSlop={10}
          onPress={() => {
            if (props.multiple) props.onChange?.([], []);
            onClear?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Clear"
        >
          <Text style={[textStyle(theme, 'lg'), { color: c.textSecondary, paddingHorizontal: 6 }, slots?.clear]}>×</Text>
        </Pressable>
      ) : null}
      <Text pointerEvents="none" style={[textStyle(theme, 'sm'), { color: c.textSecondary, marginStart: 4 }, slots?.chevron]}>▾</Text>
    </View>
  );

  return (
    <View style={style}>
      {label ? <Text style={[textStyle(theme, 'sm', 'medium'), { color: c.textSecondary, marginBottom: 6 }, slots?.label]}>{label}</Text> : null}
      {trigger}
      <PickerSheet
        visible={open}
        onClose={hide}
        title={sheetTitle ?? label}
        theme={themeOverride}
        showCancel={false}
        onConfirm={props.multiple || !closeOnSelect ? hide : undefined}
        {...sheet}
      >
        <SelectList<T>
          {...(listProps as SelectListBaseProps<T>)}
          {...({ multiple: props.multiple, value: props.value, onChange, maxSelected: (props as { maxSelected?: number }).maxSelected } as SelectValueProps<T>)}
          options={options}
          isEqual={isEqual}
          theme={themeOverride}
          styles={slots}
        />
      </PickerSheet>
    </View>
  );
}

const s = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center', minHeight: 48, borderWidth: 1, paddingVertical: 6 },
  triggerContent: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4 },
});
