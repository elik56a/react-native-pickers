import { useState } from 'react';

import { HorizontalList, TimePicker } from '@elik56a/react-native-pickers';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { daysFromNowAt } from '../../home/demo/demo.utils';
import { ALARM, REPEAT } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';

export const AlarmScreen = ({ platform }: ScreenProps) => {
  const [time, setTime] = useState(() => daysFromNowAt(0, ALARM.hours, ALARM.minutes));
  const [repeat, setRepeat] = useState(ALARM.repeat);
  return (
    <AppScreen platform={platform} title="Alarm" subtitle={`Repeats ${repeat.toLowerCase()}`}>
      <TimePicker value={time} onChange={setTime} />
      <HorizontalList variant="chips" items={REPEAT} value={repeat} onChange={setRepeat} />
    </AppScreen>
  );
};
