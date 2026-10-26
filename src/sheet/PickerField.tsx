import { View } from 'react-native';

import { usePickerTheme } from '../core';
import { FieldLabel } from './components/FieldLabel';
import { FieldTrigger } from './components/FieldTrigger';
import { usePickerField } from './hooks/usePickerField';
import { DEFAULT_PLACEHOLDER } from './sheet.constants';
import type { PickerFieldProps } from './sheet.types';

/** A labelled field that opens the sheet `children` renders, and shows `displayValue` once it closes. */
export const PickerField = ({
  label,
  placeholder = DEFAULT_PLACEHOLDER,
  displayValue = '',
  disabled = false,
  clearable = false,
  onClear,
  renderTrigger,
  renderChevron,
  onOpen,
  onClose,
  style,
  styles: slots,
  theme: themeOverride,
  testID,
  children,
}: PickerFieldProps) => {
  const theme = usePickerTheme(themeOverride);
  const field = usePickerField({ disabled, onOpen, onClose });

  return (
    <View style={style}>
      {label ? <FieldLabel label={label} theme={theme} style={slots?.label} /> : null}
      {renderTrigger ? (
        renderTrigger({ open: field.show, displayValue, disabled })
      ) : (
        <FieldTrigger
          displayValue={displayValue}
          placeholder={placeholder}
          label={label}
          open={field.open}
          disabled={disabled}
          clearable={clearable}
          onOpen={field.show}
          onClear={onClear}
          renderChevron={renderChevron}
          theme={theme}
          slots={slots}
          testID={testID}
        />
      )}
      {children({ visible: field.open, onClose: field.hide })}
    </View>
  );
};
