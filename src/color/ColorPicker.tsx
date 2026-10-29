import { View } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { COLOR_DISPLAY, COLOR_DISPLAY_DESIGN, DEFAULT_COLORS } from './color.constants';
import { styles } from './color.styles';
import type { ColorPickerProps } from './color.types';
import { getDefaultCopy, resolveColorLabels } from './color.utils';
import { IosColorLayout } from './components/layouts/IosColorLayout';
import { MaterialColorLayout } from './components/layouts/MaterialColorLayout';
import { SwatchesOnly } from './components/layouts/SwatchesOnly';
import { WebColorLayout } from './components/layouts/WebColorLayout';
import { useColorPicker } from './hooks/useColorPicker';

const LAYOUTS = {
  [COLOR_DISPLAY.tabs]: IosColorLayout,
  [COLOR_DISPLAY.swatches]: MaterialColorLayout,
  [COLOR_DISPLAY.spectrum]: WebColorLayout,
};

/** A colour, laid out as each platform does it: iOS's tabs, Google's circles, or the browser's spectrum. */
export const ColorPicker = ({
  value,
  defaultValue,
  onChange,
  display,
  colors = DEFAULT_COLORS,
  showCustom = true,
  showAlpha = false,
  onCopy,
  labels,
  style,
  styles: slots,
  theme: themeProp,
  design,
  testID,
}: ColorPickerProps) => {
  const theme = usePickerTheme(useDesignOverride(themeProp, design));
  const picker = useColorPicker({ value, defaultValue, onChange, showAlpha });
  const Layout = showCustom ? LAYOUTS[display ?? COLOR_DISPLAY_DESIGN[theme.design]] : SwatchesOnly;
  return (
    <View style={[styles.column, style, slots?.container]} {...ARROW_FOCUS} testID={testID}>
      <Layout
        picker={picker}
        colors={colors}
        showCustom={showCustom}
        showAlpha={showAlpha}
        copy={onCopy ?? getDefaultCopy()}
        labels={resolveColorLabels(labels)}
        theme={theme}
        slots={slots}
        testID={testID}
      />
    </View>
  );
};
