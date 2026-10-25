import type { ComponentRef } from 'react';
import { useRef } from 'react';
import { Text, View } from 'react-native';

import { textStyle, usePickerTheme } from '../core';
import { PickerSheet } from '../sheet';
import { Dropdown } from '../sheet/Dropdown';
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
    presentation: _presentation,
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
  const anchorRef = useRef<ComponentRef<typeof View>>(null);
  const picker = useSelectPicker(props, isEqual, anchorRef);
  const list = (
    <SelectList<T>
      {...(listProps as Omit<SelectListBaseProps<T>, 'isEqual' | 'theme' | 'styles'>)}
      {...picker.valueProps}
      isEqual={isEqual}
      theme={themeOverride}
      styles={slots}
      style={picker.presentation === 'dropdown' ? styles.dropdownList : undefined}
    />
  );

  return (
    <View style={style}>
      {label ? (
        <Text style={[textStyle(theme, 'sm', 'medium'), styles.label, { color: theme.colors.textSecondary }, slots?.label]}>{label}</Text>
      ) : null}
      <View ref={anchorRef} collapsable={false}>
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
      </View>
      {picker.presentation === 'dropdown' ? (
        <Dropdown visible={picker.open} anchor={picker.anchor} onClose={picker.hide} theme={themeOverride}>
          {list}
        </Dropdown>
      ) : (
        <PickerSheet
          visible={picker.open}
          onClose={picker.hide}
          title={sheetTitle ?? label}
          theme={themeOverride}
          presentation={picker.presentation}
          showCancel={false}
          onConfirm={props.multiple || !closeOnSelect ? picker.hide : undefined}
          {...sheet}
        >
          {list}
        </PickerSheet>
      )}
    </View>
  );
};
