import { useState } from 'react';

import { HorizontalList, WeekStrip } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { daysFromNow, startOfToday } from '../../home/demo/demo.utils';
import { CALENDAR_DAY_HEIGHT, PARTY_SIZES, TABLE, TABLE_SLOTS } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';
import { isClosedDay } from '../showcase.utils';

export const TableScreen = ({ platform }: ScreenProps) => {
  const [party, setParty] = useState(TABLE.party);
  const [date, setDate] = useState<Date | null>(() => daysFromNow(TABLE.day));
  const [slot, setSlot] = useState(TABLE.slot);
  return (
    <AppScreen
      platform={platform}
      title="Book a table"
      subtitle="Tasca do Rio · closed Mondays"
      action={<ActionButton label={`Reserve for ${party} at ${slot}`} busyLabel="Reserving…" doneLabel="✓ Table booked" />}
    >
      <HorizontalList variant="chips" items={PARTY_SIZES} value={party} onChange={setParty} />
      <WeekStrip value={date} onChange={setDate} minDate={startOfToday()} isDateDisabled={isClosedDay} dayHeight={CALENDAR_DAY_HEIGHT} />
      <HorizontalList variant="chips" items={TABLE_SLOTS} value={slot} onChange={setSlot} />
    </AppScreen>
  );
};
