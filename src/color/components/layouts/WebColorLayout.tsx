import { View } from 'react-native';

import { Touchable } from '../../../core/components/Touchable';
import { COLOR_DESIGN } from '../../color.constants';
import { styles } from '../../color.styles';
import type { ColorLayoutProps } from '../../color.types';
import { useEyeDropper } from '../../hooks/useEyeDropper';
import { AlphaSlider, HueSlider } from '../ChannelSliders';
import { EyedropperIcon } from '../ColorIcons';
import { ColorPreview } from '../ColorPreview';
import { HexInput } from '../HexInput';
import { SaturationPad } from '../SaturationPad';
import { SwatchGrid } from '../SwatchGrid';

/** The browser's colour input: the saturation square, the eyedropper and colour beside hue and opacity, the hex code, then your swatches. */
export const WebColorLayout = ({ picker, colors, showAlpha, copy, labels, theme, slots, testID }: ColorLayoutProps) => {
  const pick = useEyeDropper(picker.select);
  const shared = { picker, labels, theme, slots, testID };
  return (
    <View style={[styles.column, { gap: theme.spacing.md }]}>
      <SaturationPad {...shared} height={COLOR_DESIGN.web.padHeight} testID={testID ? `${testID}-pad` : undefined} />
      <View style={[styles.row, styles.center, { gap: theme.spacing.md }]}>
        {pick && (
          <Touchable
            theme={theme}
            onPress={pick}
            accessibilityRole="button"
            accessibilityLabel={labels.eyedropper}
            style={[styles.iconButton, { borderRadius: theme.radius.sm, borderColor: theme.colors.border }]}
          >
            <EyedropperIcon color={theme.colors.text} />
          </Touchable>
        )}
        <ColorPreview color={picker.value} shape="circle" theme={theme} />
        <View style={styles.fill}>
          <HueSlider {...shared} />
          {showAlpha && <AlphaSlider {...shared} />}
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
      {colors.length > 0 && (
        <SwatchGrid
          colors={colors}
          shape={COLOR_DESIGN.web.swatchShape}
          size={COLOR_DESIGN.web.swatchSize}
          selected={picker.rgb}
          onSelect={picker.select}
          theme={theme}
          slots={slots}
        />
      )}
    </View>
  );
};
