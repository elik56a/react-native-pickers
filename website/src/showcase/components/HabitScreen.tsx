import { useState } from 'react';

import { ColorPickerField, DatePicker, TimePickerField } from '@elik56a/react-native-pickers';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { daysFromNow, daysFromNowAt, deviceSheetProps, plural } from '../../home/demo/demo.utils';
import { CALENDAR_DAY_HEIGHT, HABIT } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';

export const HabitScreen = ({ platform, screenHeight }: ScreenProps) => {
  const [days, setDays] = useState(() => HABIT.ranDaysAgo.map((n) => daysFromNow(-n)));
  const [color, setColor] = useState(HABIT.color);
  const [reminder, setReminder] = useState(() => daysFromNowAt(0, HABIT.reminder.hours, HABIT.reminder.minutes));
  return (
    <AppScreen platform={platform} title="Morning run 🏃" subtitle={`${plural(days.length, 'run')} logged · tap a day`}>
      <DatePicker
        mode="multiple"
        value={days}
        onChange={setDays}
        maxDate={new Date()}
        dayHeight={CALENDAR_DAY_HEIGHT}
        theme={{ colors: { primary: color } }}
      />
      <TimePickerField
        label="Daily reminder"
        value={reminder}
        onConfirm={setReminder}
        minuteInterval={HABIT.minuteInterval}
        sheetProps={deviceSheetProps(platform, screenHeight)}
      />
      <ColorPickerField
        label="Colour"
        value={color}
        onConfirm={setColor}
        colors={HABIT.colors}
        showCustom={false}
        sheetProps={deviceSheetProps(platform, screenHeight)}
      />
    </AppScreen>
  );
};
