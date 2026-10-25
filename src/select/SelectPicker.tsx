import { Text, View } from 'react-native';

import { textStyle, usePickerTheme } from '../core';
import { PickerSheet } from '../sheet/PickerSheet';
import { SelectTrigger } from './components/SelectTrigger';
import { useSelectPicker } from './hooks/useSelectPicker';
import { SelectList } from './SelectList';
import { DEFAULT_PLACEHOLDER } from './select.constants';
import { styles } from './select.styles';
import type { SelectListBaseProps, SelectPickerProps } from './select.types';

export const SelectPicker = <T,>(props: SelectPickerProps<T>) => {
  const {
    placeholder = DEFAULT_PLACEHOLDER,
    label,
    disabled = false,
    clearable = false,
    onClear: _onClear,
    chips = true,
    closeOnSelect = true,
    renderTrigger,
    sheetTitle,
    sheet,
    onOpen: _onOpen,
    onClose: _onClose,
    style,
    styles: slots,
    theme: themeOverride,
    isEqual = Object.is,
    multiple: _multiple,
    value: _value,
    onChange: _onChange,
    ...listProps
  } = props;
  const theme = usePickerTheme(themeOverride);
  const picker = useSelectPicker(props, isEqual);

  return (
    <View style={style}>
      {label ? (
        <Text style={[textStyle(theme, 'sm', 'medium'), styles.label, { color: theme.colors.textSecondary }, slots?.label]}>{label}</Text>
      ) : null}
      {renderTrigger ? (
        renderTrigger({ open: picker.show, selected: picker.selected, disabled })
      ) : (
        <SelectTrigger
          selected={picker.selected}
          multiple={!!props.multiple}
          chips={chips}
          placeholder={placeholder}
          label={label}
          open={picker.open}
          disabled={disabled}
          clearable={clearable}
          onOpen={picker.show}
          onRemove={picker.removeOption}
          onClear={picker.clear}
          theme={theme}
          slots={slots}
        />
      )}
      <PickerSheet
        visible={picker.open}
        onClose={picker.hide}
        title={sheetTitle ?? label}
        theme={themeOverride}
        showCancel={false}
        onConfirm={props.multiple || !closeOnSelect ? picker.hide : undefined}
        {...sheet}
      >
        <SelectList<T>
          {...(listProps as Omit<SelectListBaseProps<T>, 'isEqual' | 'theme' | 'styles'>)}
          {...picker.valueProps}
          isEqual={isEqual}
          theme={themeOverride}
          styles={slots}
        />
      </PickerSheet>
    </View>
  );
};
