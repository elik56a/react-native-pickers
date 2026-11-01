import { View } from 'react-native';

import { HorizontalList } from '../../../list';
import { COLOR_DESIGN, COLOR_TAB } from '../../color.constants';
import { styles } from '../../color.styles';
import type { ColorLayoutProps } from '../../color.types';
import { useColorView } from '../../hooks/useColorView';
import { AlphaSlider, RgbSliders } from '../ChannelSliders';
import { ColorPreview } from '../ColorPreview';
import { HexInput } from '../HexInput';
import { IosGrid } from '../IosGrid';
import { SpectrumPad } from '../SpectrumPad';
import { SwatchGrid } from '../SwatchGrid';

/** iOS's colour picker: Grid, Spectrum and Sliders tabs, an opacity slider, then the colour beside your swatches. */
export const IosColorLayout = ({ picker, colors, showAlpha, copy, labels, theme, slots, testID }: ColorLayoutProps) => {
  const view = useColorView(false);
  const shared = { picker, labels, theme, slots, testID };
  const tabs = [
    { label: labels.grid, value: COLOR_TAB.grid },
    { label: labels.spectrum, value: COLOR_TAB.spectrum },
    { label: labels.sliders, value: COLOR_TAB.sliders },
  ];
  return (
    <View style={[styles.column, { gap: theme.spacing.lg }]}>
      <HorizontalList items={tabs} value={view.tab} onChange={view.setTab} theme={theme} />
      {view.tab === COLOR_TAB.grid && <IosGrid selected={picker.rgb} onSelect={picker.select} theme={theme} />}
      {view.tab === COLOR_TAB.spectrum && (
        <SpectrumPad {...shared} height={COLOR_DESIGN.ios.padHeight} testID={testID ? `${testID}-spectrum` : undefined} />
      )}
      {view.tab === COLOR_TAB.sliders && (
        <View style={[styles.column, { gap: theme.spacing.sm }]}>
          <RgbSliders {...shared} />
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
      )}
      {showAlpha && <AlphaSlider {...shared} captioned />}
      <View style={[styles.row, styles.centerRow, { gap: theme.spacing.md }]}>
        <ColorPreview color={picker.value} shape="large" theme={theme} />
        {colors.length > 0 && (
          <View style={styles.fill}>
            <SwatchGrid
              colors={colors}
              shape="circle"
              size={COLOR_DESIGN.ios.swatchSize}
              scroll
              selected={picker.rgb}
              onSelect={picker.select}
              theme={theme}
              slots={slots}
            />
          </View>
        )}
      </View>
    </View>
  );
};
