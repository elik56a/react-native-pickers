import { View } from 'react-native';

import { COLOR_DESIGN } from '../../color.constants';
import { styles } from '../../color.styles';
import type { ColorLayoutProps } from '../../color.types';
import { AlphaSlider } from '../ChannelSliders';
import { SwatchGrid } from '../SwatchGrid';

/** `showCustom={false}`: only your swatches, in the design's shape, and opacity if asked for. */
export const SwatchesOnly = ({ picker, colors, showAlpha, labels, theme, slots, testID }: ColorLayoutProps) => (
  <View style={[styles.column, { gap: theme.spacing.md }]}>
    <SwatchGrid
      colors={colors}
      shape={COLOR_DESIGN[theme.design].swatchShape}
      size={COLOR_DESIGN[theme.design].swatchSize}
      selected={picker.rgb}
      onSelect={picker.select}
      theme={theme}
      slots={slots}
    />
    {showAlpha ? <AlphaSlider picker={picker} labels={labels} theme={theme} slots={slots} testID={testID} /> : null}
  </View>
);
