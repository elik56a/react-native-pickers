import { View } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { FieldLabel } from './components/FieldLabel';
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
  style,
  styles: slots,
  theme: themeProp,
  design,
  testID,
  children,
}: PickerFieldProps) => {
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const field = usePickerField({ disabled, presentation, onOpen, onClose });

  return (
    <View style={style}>
      {label ? <FieldLabel label={label} theme={theme} style={slots?.label} /> : null}
      <View ref={field.anchor.ref} collapsable={false}>
        {renderTrigger ? (
          renderTrigger({ open: field.show, displayValue, disabled })
        ) : (
          <FieldTrigger
            displayValue={displayValue}
            icon={icon}
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
      </View>
      <FieldSheetContext.Provider value={field.sheet}>{children({ visible: field.open, onClose: field.hide })}</FieldSheetContext.Provider>
    </View>
  );
};
