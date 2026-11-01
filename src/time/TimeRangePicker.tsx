import { View } from 'react-native';

import { useComponentTheme } from '../core/theme/ThemeProvider';
import { formatDuration } from '../duration/duration.utils';
import { RangeEnds } from './components/RangeEnds';
import { useTimeRange } from './hooks/useTimeRange';
import { TimePicker } from './TimePicker';
import { DEFAULT_END_LABEL, DEFAULT_START_LABEL } from './time.constants';
import type { TimeRangePickerProps } from './time.types';
import { getTimeRangeEndItems, getTimeRangeSeconds } from './time.utils';

/** A start and an end time: both ends, as each design shows them, and a TimePicker that edits the end that's chosen. */
export const TimeRangePicker = (props: TimeRangePickerProps) => {
  const {
    value: _value,
    defaultValue: _defaultValue,
    onChange: _onChange,
    minDuration: _minDuration,
    maxDuration: _maxDuration,
    allowOvernight: _allowOvernight,
    startLabel = DEFAULT_START_LABEL,
    endLabel = DEFAULT_END_LABEL,
    style,
    testID,
    ...pickerProps
  } = props;
  const { theme } = useComponentTheme(pickerProps.theme, pickerProps.design);
  const { range, active, setActive, move } = useTimeRange(props);
  return (
    <View style={style} testID={testID}>
      <RangeEnds
        items={getTimeRangeEndItems(range, { start: startLabel, end: endLabel }, pickerProps)}
        active={active}
        onSelect={setActive}
        duration={formatDuration(getTimeRangeSeconds(range))}
        theme={theme}
        testID={testID && `${testID}-ends`}
        renderPicker={(end) => (
          // A fresh picker per end, so a list or wheel opens at that end's time and a dial starts again on the hours.
          <TimePicker
            key={end}
            {...pickerProps}
            value={range[end]}
            onChange={(time) => move(end, time)}
            testID={testID && `${testID}-${end}`}
          />
        )}
      />
    </View>
  );
};
