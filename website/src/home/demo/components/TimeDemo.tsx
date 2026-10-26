import { useState } from 'react';

import { TimePicker } from '@elik56a/react-native-pickers';
import type { TabOptions } from '../../playground/playground.types';

export const TimeDemo = ({ options }: { options: TabOptions<'time'> }) => {
  const [time, setTime] = useState(() => new Date());
  return (
    <TimePicker
      value={time}
      onChange={setTime}
      format={options.format}
      minuteInterval={options.minuteInterval}
      showSeconds={options.showSeconds}
    />
  );
};
