import { View } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { PickerField } from '../sheet';
import { splitFieldProps } from '../sheet/sheet.utils';
import { ColorPickerSheet } from './ColorPickerSheet';
import { styles } from './color.styles';
import type { ColorPickerFieldProps } from './color.types';
import { normalizeHex } from './color.utils';

/** A field that opens a ColorPickerSheet and shows the confirmed colour: a swatch and its hex code. */
export const ColorPickerField = (props: ColorPickerFieldProps) => {
  const { field, sheet } = splitFieldProps(props);
  const theme = usePickerTheme(useDesignOverride(props.theme, props.design));
  const hex = props.value ? normalizeHex(props.value) : null;
  return (
    <PickerField
      {...field}
      displayValue={field.displayValue ?? hex ?? ''}
      icon={
        hex ? (
          <View style={[styles.fieldSwatch, { backgroundColor: hex, borderRadius: theme.radius.sm, borderColor: theme.colors.border }]} />
        ) : null
      }
    >
      {(state) => <ColorPickerSheet title={field.label} {...sheet} {...state} />}
    </PickerField>
  );
};
