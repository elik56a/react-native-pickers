import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { Agenda } from './Agenda';
import type { ScheduleEvent } from './schedule.types';

const at = (day: number, hour: number, minute = 0) => new Date(2026, 10, day, hour, minute);
const EVENTS: ScheduleEvent[] = [
  { id: 'standup', title: 'Standup', start: at(9, 9), end: at(9, 9, 30), subtitle: 'Room 4' },
  { id: 'offsite', title: 'Offsite', start: at(9, 0), end: at(9, 0), allDay: true },
  { id: 'gym', title: 'Gym', start: at(12, 18), end: at(12, 19), color: '#2E7D32' },
];

describe('Agenda', () => {
  it("lists each day's events under a band on iOS, all-day first", async () => {
    const onEventPress = jest.fn();
    await render(<Agenda events={EVENTS} design="ios" locale="en-US" format="12h" onEventPress={onEventPress} />);
    expect(screen.getByText('Monday, November 9')).toBeTruthy();
    expect(screen.getByText('Thursday, November 12')).toBeTruthy();
    expect(screen.getByText('Room 4')).toBeTruthy();
    expect(screen.getByText('9:00 AM')).toBeTruthy();
    expect(screen.getByText('9:30 AM')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Gym, 6:00 PM – 7:00 PM'));
    expect(onEventPress).toHaveBeenCalledWith(EVENTS[2]);
  });

  it('puts the date beside the first event of each day in Material', async () => {
    await render(<Agenda events={EVENTS} design="material" locale="en-US" format="12h" />);
    expect(screen.getByLabelText('Monday, November 9, 2026')).toBeTruthy();
    expect(screen.getByText('Mon')).toBeTruthy();
    expect(screen.getByText('9:00 AM – 9:30 AM · Room 4')).toBeTruthy();
    expect(screen.queryByText('Monday, November 9')).toBeNull();
  });

  it('writes the date as "NOV, MON" on the web, and fills the days between with showEmptyDays', async () => {
    await render(<Agenda events={EVENTS} design="web" locale="en-US" showEmptyDays labels={{ noEvents: 'Nothing on' }} />);
    expect(screen.getByText('Nov, Mon')).toBeTruthy();
    expect(screen.getAllByText('Nothing on')).toHaveLength(2);
  });

  it('says there are no events when the list is empty', async () => {
    await render(<Agenda events={[]} />);
    expect(screen.getByText('No events')).toBeTruthy();
  });

  it('draws custom events and dates', async () => {
    await render(
      <Agenda
        events={EVENTS}
        design="ios"
        renderEvent={({ event }) => <Text>{`* ${event.title}`}</Text>}
        renderDayHeader={({ date }) => <Text>{`Day ${date.getDate()}`}</Text>}
      />
    );
    expect(screen.getByText('* Gym')).toBeTruthy();
    expect(screen.getByText('Day 12')).toBeTruthy();
  });

  it('reports the day at the top as the user scrolls, but not a change of selectedDate from outside', async () => {
    const onVisibleDateChange = jest.fn();
    const { rerender } = await render(
      <Agenda events={EVENTS} selectedDate={at(9, 0)} onVisibleDateChange={onVisibleDateChange} testID="agenda" />
    );
    await rerender(<Agenda events={EVENTS} selectedDate={at(12, 0)} onVisibleDateChange={onVisibleDateChange} testID="agenda" />);
    expect(onVisibleDateChange).not.toHaveBeenCalled();
  });
});
