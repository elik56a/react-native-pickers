import { useState } from 'react';
import { Text, View } from 'react-native';

import { Slider, usePickerTheme } from '@elik56a/react-native-pickers';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { DISPLAY, FOCUS_MARKS, HOURS_IN_DAY, TEXT_SIZE_RANGE, TEXT_SIZES } from '../showcase.constants';
import { styles } from '../showcase.styles';
import type { ScreenProps } from '../showcase.types';
import { formatHour, previewOpacity, textSizeLabel } from '../showcase.utils';
import { SliderSetting } from './SliderSetting';

export const DisplayScreen = ({ platform }: ScreenProps) => {
  const { colors } = usePickerTheme();
  const [brightness, setBrightness] = useState(DISPLAY.brightness);
  const [textSize, setTextSize] = useState(DISPLAY.textSize);
  const [focus, setFocus] = useState(DISPLAY.focus);
  return (
    <AppScreen platform={platform} title="Display & text" subtitle={`Focus ${formatHour(focus[0])} – ${formatHour(focus[1])}`}>
      <View style={[styles.preview, { backgroundColor: colors.surface, opacity: previewOpacity(brightness) }]}>
        <Text style={[styles.previewTitle, { color: colors.text, fontSize: textSize + 2 }]}>Good morning ☀️</Text>
        <Text style={[styles.previewBody, { color: colors.textSecondary, fontSize: textSize }]}>
          Three meetings today, the first at 10.
        </Text>
      </View>
      <SliderSetting label="Brightness" value={`${brightness}%`}>
        <Slider
          value={brightness}
          onValueChanging={setBrightness}
          onChange={setBrightness}
          minimumIcon={<Text style={styles.icon}>🔅</Text>}
          maximumIcon={<Text style={styles.icon}>🔆</Text>}
          formatValue={(v) => `${v}%`}
          accessibilityLabel="Brightness"
        />
      </SliderSetting>
      <SliderSetting label="Text size" value={textSizeLabel(textSize)}>
        <Slider
          min={TEXT_SIZE_RANGE.min}
          max={TEXT_SIZE_RANGE.max}
          marks={TEXT_SIZES}
          snapToMarks
          value={textSize}
          onValueChanging={setTextSize}
          onChange={setTextSize}
          formatValue={(v) => `${v} pt`}
          accessibilityLabel="Text size"
        />
      </SliderSetting>
      <SliderSetting label="Focus hours" value={`${focus[1] - focus[0]} h`}>
        <Slider
          range
          min={0}
          max={HOURS_IN_DAY}
          marks={FOCUS_MARKS}
          value={focus}
          onChange={setFocus}
          onValueChanging={setFocus}
          formatValue={formatHour}
          thumbLabels={['Focus starts', 'Focus ends']}
          accessibilityLabel="Focus hours"
        />
      </SliderSetting>
    </AppScreen>
  );
};
