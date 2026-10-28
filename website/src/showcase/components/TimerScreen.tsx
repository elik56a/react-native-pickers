import { DurationPicker, HorizontalList } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { useTimer } from '../hooks/useTimer';
import { TIMER_PRESET_ITEMS } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';

export const TimerScreen = ({ platform }: ScreenProps) => {
  const timer = useTimer();
  return (
    <AppScreen
      platform={platform}
      title="Interval timer"
      subtitle={timer.label}
      action={<ActionButton label="Start" busyLabel="Get ready…" doneLabel="✓ Go!" />}
    >
      <HorizontalList variant="chips" items={TIMER_PRESET_ITEMS} value={timer.preset} onChange={timer.choosePreset} />
      <DurationPicker value={timer.seconds} onChange={timer.setSeconds} showSeconds />
    </AppScreen>
  );
};
