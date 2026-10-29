import { View } from 'react-native';

import { COLOR_DESIGN } from '../../color.constants';
import { styles } from '../../color.styles';
import type { ColorLayoutProps } from '../../color.types';
import { isSwatch } from '../../color.utils';
import { useColorView } from '../../hooks/useColorView';
import { AlphaSlider, HueSlider } from '../ChannelSliders';
import { ColorPreview } from '../ColorPreview';
import { HexInput } from '../HexInput';
import { SaturationPad } from '../SaturationPad';
import { SwatchGrid } from '../SwatchGrid';

/** Google's apps: circles to tap, and a Custom circle that opens the square, hue and hex; open already for a colour off the palette. */
export const MaterialColorLayout = ({ picker, colors, showAlpha, copy, labels, theme, slots, testID }: ColorLayoutProps) => {
  const view = useColorView(!isSwatch(colors, picker.rgb));
  const shared = { picker, labels, theme, slots, testID };
  return (
    <View style={[styles.column, { gap: theme.spacing.lg }]}>
      <SwatchGrid
        colors={colors}
        shape="circle"
        size={COLOR_DESIGN.material.swatchSize}
        selected={picker.rgb}
        onSelect={picker.select}
        custom={{ open: view.customOpen, label: labels.custom, onPress: view.toggleCustom }}
        theme={theme}
        slots={slots}
      />
      {view.customOpen ? (
        <View style={[styles.column, { gap: theme.spacing.md }]}>
          <SaturationPad {...shared} height={COLOR_DESIGN.material.padHeight} testID={testID ? `${testID}-pad` : undefined} />
          <View style={[styles.row, styles.center, { gap: theme.spacing.md }]}>
            <ColorPreview color={picker.value} shape="circle" theme={theme} />
            <View style={styles.fill}>
              <HueSlider {...shared} />
            </View>
          </View>
          <HexInput
            value={picker.value}
            rgb={picker.rgb}
            label={labels.hex}
            onChange={picker.select}
            copy={copy}
            copyLabel={labels.copy}
            copiedLabel={labels.copied}
            theme={theme}
            slots={slots}
            testID={testID ? `${testID}-hex` : undefined}
          />
        </View>
      ) : null}
      {showAlpha ? <AlphaSlider {...shared} /> : null}
    </View>
  );
};
