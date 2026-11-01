import { View } from 'react-native';

import { useComponentTheme } from '../core/theme/ThemeProvider';
import { FieldFrame } from './components/FieldFrame';
import { FieldTrigger } from './components/FieldTrigger';
import { FieldSheetContext } from './hooks/useFieldSheet';
import { usePickerField } from './hooks/usePickerField';
import { DEFAULT_PLACEHOLDER } from './sheet.constants';
import type { PickerFieldProps } from './sheet.types';

/** A labelled field that opens the sheet `children` renders (by default, a dropdown under it on the web and a bottom sheet on native), and shows `displayValue` once it closes. */
export const PickerField = ({
  label,
  placeholder = DEFAULT_PLACEHOLDER,
  displayValue = '',
  icon,
  disabled = false,
  clearable = false,
  onClear,
  renderTrigger,
  renderChevron,
  onOpen,
  onClose,
  presentation,
  error,
  helperText,
  required,
  style,
  styles: slots,
  theme: themeProp,
  design,
  testID,
  children,
}: PickerFieldProps) => {
  const { theme } = useComponentTheme(themeProp, design);
  const field = usePickerField({ disabled, presentation, onOpen, onClose });

  return (
    <View style={style}>
      <FieldFrame label={label} error={error} helperText={helperText} required={required} theme={theme} slots={slots}>
        <View ref={field.anchor.ref} collapsable={false}>
          {renderTrigger ? (
            renderTrigger({ open: field.toggle, displayValue, disabled, error })
          ) : (
            <FieldTrigger
              displayValue={displayValue}
              icon={icon}
              placeholder={placeholder}
              label={label}
              open={field.open}
              disabled={disabled}
              clearable={clearable}
              error={error}
              required={required}
              onOpen={field.toggle}
              onClear={onClear}
              renderChevron={renderChevron}
              theme={theme}
              slots={slots}
              testID={testID}
            />
          )}
        </View>
      </FieldFrame>
      <FieldSheetContext.Provider value={field.sheet}>{children({ visible: field.open, onClose: field.hide })}</FieldSheetContext.Provider>
    </View>
  );
};
