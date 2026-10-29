import type { PickerTheme, SlotStyles } from '../../core';
import { SLIDER_SEGMENTS } from '../color.constants';
import type { ColorLabels, ColorPickerSlot, ColorPickerState } from '../color.types';
import { degrees, getAlphaTrack, getHueTrack, getRgbTrack, hexToRgb, percent, pureHue, rgbToHex } from '../color.utils';
import { ColorSlider } from './ColorSlider';

interface ChannelSliderProps {
  picker: ColorPickerState;
  labels: ColorLabels;
  /** iOS names each slider and shows its value above it */
  captioned?: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<ColorPickerSlot>;
  testID?: string;
}

const HUE_TRACK = getHueTrack(SLIDER_SEGMENTS);
const RGB = [0, 1, 2] as const;
const RGB_LABELS = ['red', 'green', 'blue'] as const;

const id = (testID: string | undefined, part: string) => (testID ? `${testID}-${part}` : undefined);

export const HueSlider = ({ picker, labels, captioned, theme, slots, testID }: ChannelSliderProps) => (
  <ColorSlider
    label={labels.hue}
    value={picker.hsv.hue}
    onChange={(hue) => picker.setHsv({ hue })}
    colors={HUE_TRACK}
    thumbColor={pureHue(picker.hsv.hue)}
    valueText={degrees(picker.hsv.hue)}
    showLabel={captioned}
    showValue={captioned}
    theme={theme}
    slots={slots}
    testID={id(testID, 'hue')}
  />
);

export const AlphaSlider = ({ picker, labels, captioned, theme, slots, testID }: ChannelSliderProps) => (
  <ColorSlider
    label={labels.opacity}
    value={picker.alpha}
    onChange={picker.setAlpha}
    colors={getAlphaTrack(picker.rgb, SLIDER_SEGMENTS)}
    thumbColor={picker.rgb}
    valueText={percent(picker.alpha)}
    showLabel={captioned}
    showValue={captioned}
    checkered
    theme={theme}
    slots={slots}
    testID={id(testID, 'opacity')}
  />
);

/** iOS's Sliders tab: red, green and blue, 0–255. */
export const RgbSliders = ({ picker, labels, theme, slots, testID }: ChannelSliderProps) => {
  const rgb = hexToRgb(picker.rgb);
  return RGB.map((channel) => (
    <ColorSlider
      key={channel}
      label={labels[RGB_LABELS[channel]]}
      value={rgb[channel]}
      onChange={(amount) => picker.select(rgbToHex(rgb.map((c, i) => (i === channel ? amount : c)) as [number, number, number]))}
      colors={getRgbTrack(picker.rgb, channel, SLIDER_SEGMENTS)}
      thumbColor={picker.rgb}
      valueText={String(Math.round(rgb[channel] * 255))}
      showLabel
      showValue
      theme={theme}
      slots={slots}
      testID={id(testID, RGB_LABELS[channel])}
    />
  ));
};
