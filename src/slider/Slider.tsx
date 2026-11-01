import { View } from 'react-native';

import { useComponentTheme } from '../core/theme/ThemeProvider';
import { MarkLabels } from './components/MarkLabels';
import { SliderHalo } from './components/SliderHalo';
import { SliderThumb } from './components/SliderThumb';
import { SliderTrack } from './components/SliderTrack';
import { ValueLabel } from './components/ValueLabel';
import { useSlider } from './hooks/useSlider';
import { styles } from './slider.styles';
import type { SliderProps } from './slider.types';

/** A slider drawn the platform's way: iOS's white knob, Material 3's handle with its value bubble, or a browser's range input. One thumb, or two with `range`. */
export const Slider = (props: SliderProps) => {
  const { disabled, minimumIcon, maximumIcon, style, styles: slots, theme: themeProp, design, testID } = props;
  const { theme } = useComponentTheme(themeProp, design);
  const slider = useSlider(props, theme);

  return (
    <View
      style={[
        styles.row,
        { gap: theme.spacing.md },
        slider.reserveValueLabel && styles.reserveValueLabel,
        disabled && styles.disabled,
        slots?.container,
        style,
      ]}
      testID={testID}
    >
      {minimumIcon}
      <View style={styles.column}>
        <View
          style={[styles.track, disabled && styles.noCursor]}
          onLayout={slider.onLayout}
          {...slider.panHandlers}
          {...slider.hoverHandlers}
          testID={testID ? `${testID}-track` : undefined}
        >
          <SliderTrack segments={slider.segments} marks={slider.marks} design={slider.design} theme={theme} slots={slots} />
          {slider.design.halo > 0 &&
            slider.thumbs.map((thumb) => (
              <SliderHalo
                key={thumb.key}
                x={thumb.x}
                level={thumb.halo}
                size={slider.design.halo}
                theme={theme}
                testID={testID ? `${testID}-halo-${thumb.key}` : undefined}
              />
            ))}
          {slider.thumbs.map((thumb) => (
            <SliderThumb
              key={thumb.key}
              thumb={thumb}
              design={slider.design}
              theme={theme}
              slots={slots}
              testID={testID ? `${testID}-thumb-${thumb.key}` : undefined}
            />
          ))}
          {slider.thumbs
            .filter((thumb) => thumb.showValueLabel)
            .map((thumb) => (
              <ValueLabel key={thumb.key} x={thumb.x} text={thumb.valueText} design={slider.design} theme={theme} slots={slots} />
            ))}
        </View>
        {slider.markLabels.length > 0 && <MarkLabels labels={slider.markLabels} theme={theme} slots={slots} />}
      </View>
      {maximumIcon}
    </View>
  );
};
