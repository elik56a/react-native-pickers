import { View } from 'react-native';

import { PAD_BLACK, PAD_SEGMENTS, PAD_WHITE } from '../color.constants';
import { styles } from '../color.styles';
import type { ColorLabels, ColorPadProps, ColorPickerState } from '../color.types';
import { getFade, percent, pureHue } from '../color.utils';
import { ColorPad } from './ColorPad';

const WHITE_FADE = getFade(PAD_SEGMENTS, 1, 0);
const BLACK_FADE = getFade(PAD_SEGMENTS, 0, 1);

/** The browser's and Material's square: saturation across, brightness up, over the current hue. */
export const SaturationPad = ({
  picker,
  labels,
  ...pad
}: Pick<ColorPadProps, 'height' | 'theme' | 'slots' | 'testID'> & { picker: ColorPickerState; labels: ColorLabels }) => {
  const { hue, saturation, brightness } = picker.hsv;
  return (
    <ColorPad
      {...pad}
      label={labels.saturation}
      x={saturation}
      y={1 - brightness}
      onChange={(x, y) => picker.setHsv({ saturation: x, brightness: 1 - y })}
      thumbColor={picker.rgb}
      valueText={`${labels.saturation} ${percent(saturation)}, ${labels.brightness} ${percent(brightness)}`}
      upLabel={`${labels.brightness} +`}
      downLabel={`${labels.brightness} −`}
    >
      <View style={[styles.layer, { backgroundColor: pureHue(hue) }]} />
      <View style={styles.layerRow}>
        {WHITE_FADE.map(({ key, opacity }) => (
          <View key={key} style={[styles.fill, { backgroundColor: PAD_WHITE, opacity }]} />
        ))}
      </View>
      <View style={styles.layerColumn}>
        {BLACK_FADE.map(({ key, opacity }) => (
          <View key={key} style={[styles.fill, { backgroundColor: PAD_BLACK, opacity }]} />
        ))}
      </View>
    </ColorPad>
  );
};
