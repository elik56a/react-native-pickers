import { View } from 'react-native';

import { PAD_BLACK, PAD_SEGMENTS, PAD_WHITE, SLIDER_SEGMENTS } from '../color.constants';
import { styles } from '../color.styles';
import type { ColorLabels, ColorPadProps, ColorPickerState } from '../color.types';
import { degrees, getFade, getHueTrack, hsvToSpectrum, percent, spectrumToHsv, toSlices } from '../color.utils';
import { ColorPad } from './ColorPad';

const HUES = toSlices(getHueTrack(SLIDER_SEGMENTS));
const TINT = getFade(PAD_SEGMENTS / 2, 1, 0);
const SHADE = getFade(PAD_SEGMENTS / 2, 0, 1);

/** iOS's spectrum: every hue across, white at the top, the full colour in the middle and black at the bottom. */
export const SpectrumPad = ({
  picker,
  labels,
  ...pad
}: Pick<ColorPadProps, 'height' | 'theme' | 'slots' | 'testID'> & { picker: ColorPickerState; labels: ColorLabels }) => {
  const { x, y } = hsvToSpectrum(picker.hsv);
  return (
    <ColorPad
      {...pad}
      label={labels.spectrum}
      x={x}
      y={y}
      onChange={(nx, ny) => picker.setHsv(spectrumToHsv(nx, ny))}
      thumbColor={picker.rgb}
      valueText={`${labels.hue} ${degrees(picker.hsv.hue)}, ${labels.brightness} ${percent(1 - y)}`}
      upLabel={`${labels.brightness} +`}
      downLabel={`${labels.brightness} −`}
    >
      <View style={styles.layerRow}>
        {HUES.map(({ key, color }) => (
          <View key={key} style={[styles.fill, { backgroundColor: color }]} />
        ))}
      </View>
      <View style={styles.halfTop}>
        {TINT.map(({ key, opacity }) => (
          <View key={key} style={[styles.fill, { backgroundColor: PAD_WHITE, opacity }]} />
        ))}
      </View>
      <View style={styles.halfBottom}>
        {SHADE.map(({ key, opacity }) => (
          <View key={key} style={[styles.fill, { backgroundColor: PAD_BLACK, opacity }]} />
        ))}
      </View>
    </ColorPad>
  );
};
