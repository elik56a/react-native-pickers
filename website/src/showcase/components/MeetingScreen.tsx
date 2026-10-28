import { useState } from 'react';

import { DateTimePickerField, HorizontalList, SelectPicker } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { daysFromNowAt, deviceSheetProps, plural } from '../../home/demo/demo.utils';
import { DURATIONS, MEETING, PEOPLE, TIME_ZONES } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';

export const MeetingScreen = ({ platform, screenHeight }: ScreenProps) => {
  const sheetProps = deviceSheetProps(platform, screenHeight);
  const [when, setWhen] = useState(() => daysFromNowAt(MEETING.day, MEETING.hours, MEETING.minutes));
  const [duration, setDuration] = useState(MEETING.duration);
  const [zone, setZone] = useState<string | null>(TIME_ZONES[0]?.value ?? null);
  const [people, setPeople] = useState(MEETING.people);
  return (
    <AppScreen
      platform={platform}
      title="New meeting"
      subtitle={`${duration} min · ${plural(people.length, 'guest')}`}
      action={<ActionButton label="Send invite" busyLabel="Sending…" doneLabel="✓ Invite sent" />}
    >
      <DateTimePickerField label="When" value={when} onConfirm={setWhen} minuteInterval={MEETING.minuteInterval} sheetProps={sheetProps} />
      <HorizontalList items={DURATIONS} value={duration} onChange={setDuration} />
      <SelectPicker label="Time zone" options={TIME_ZONES} value={zone} onChange={setZone} sheet={{ sheetProps }} />
      <SelectPicker label="Guests" options={PEOPLE} multiple value={people} onChange={setPeople} sheet={{ sheetProps }} />
    </AppScreen>
  );
};
