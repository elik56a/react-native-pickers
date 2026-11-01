import { View } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { PickerSheet } from '../sheet';
import { FieldFrame } from '../sheet/components/FieldFrame';
import { Dropdown } from '../sheet/Dropdown';
import { DEFAULT_PLACEHOLDER } from '../sheet/sheet.constants';
import { SelectSearchField } from './components/SelectSearchField';
import { SelectTrigger } from './components/SelectTrigger';
import { useSelectPicker } from './hooks/useSelectPicker';
import { SelectList } from './SelectList';
import { DEFAULT_SEARCH_PLACEHOLDER, SELECT_DROPDOWN_MIN_WIDTH, SELECT_PRESENTATION } from './select.constants';
import { LIST_STYLE } from './select.styles';
import type { SelectListBaseProps, SelectPickerProps } from './select.types';

export const SelectPicker = <T,>(props: SelectPickerProps<T>) => {
  const {
    placeholder = DEFAULT_PLACEHOLDER,
    label,
    disabled = false,
    clearable = false,
    onClear: _onClear,
    error,
    helperText,
    required,
    chips = true,
    closeOnSelect = true,
    renderTrigger,
    renderChevron,
    sheetTitle,
    sheet,
    presentation: _presentation,
    onOpen: _onOpen,
    onClose: _onClose,
    style,
    styles: slots,
    theme: themeProp,
    design,
    isEqual = Object.is,
    multiple: _multiple,
    value: _value,
    onChange: _onChange,
    ...listProps
  } = props;
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const picker = useSelectPicker(props, isEqual);
  const list = (
    <SelectList<T>
      {...(listProps as Omit<SelectListBaseProps<T>, 'isEqual' | 'theme' | 'styles'>)}
      {...picker.valueProps}
      query={picker.searchInField ? picker.query : undefined}
      onCreate={picker.onCreate}
      isEqual={isEqual}
      theme={themeOverride}
      styles={slots}
      style={LIST_STYLE[picker.presentation]}
    />
  );

  return (
    <View style={style}>
      <FieldFrame label={label} error={error} helperText={helperText} required={required} theme={theme} slots={slots}>
        <View ref={picker.anchor.ref} collapsable={false}>
          {renderTrigger ? (
            renderTrigger({ open: picker.toggle, selected: picker.selected, disabled, error })
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
              error={error}
              required={required}
              onOpen={picker.toggle}
              onRemove={picker.removeOption}
              onClear={picker.clear}
              renderChevron={renderChevron}
              theme={theme}
              slots={slots}
            />
          )}
        </View>
      </FieldFrame>
      {picker.presentation === SELECT_PRESENTATION.dropdown ? (
        <Dropdown
          visible={picker.open}
          anchor={picker.anchor.rect}
          minWidth={SELECT_DROPDOWN_MIN_WIDTH}
          onClose={picker.hide}
          theme={themeOverride}
          overlay={
            picker.searchInField ? (
              <SelectSearchField
                query={picker.query}
                onChangeQuery={picker.setQuery}
                placeholder={(!props.multiple && picker.selected[0]?.label) || listProps.searchPlaceholder || DEFAULT_SEARCH_PLACEHOLDER}
                renderChevron={renderChevron}
                theme={theme}
                slots={slots}
              />
            ) : null
          }
        >
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
