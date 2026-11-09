import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { PickersProvider } from '../core/theme/ThemeProvider';
import type { ScheduleEvent } from './schedule.types';
import { Timeline } from './Timeline';

const at = (day: number, hour: number, minute = 0) => new Date(2026, 10, day, hour, minute);
const EVENTS: ScheduleEvent[] = [
  { id: 'standup', title: 'Standup', start: at(9, 9), end: at(9, 9, 30) },
  { id: 'review', title: 'Design review', start: at(9, 9, 15), end: at(9, 10), color: '#2E7D32' },
  { id: 'offsite', title: 'Offsite', start: at(9, 0), end: at(10, 0), allDay: true },
  { id: 'gym', title: 'Gym', start: at(10, 18), end: at(10, 19) },
];

describe('Timeline', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(at(9, 12, 0));
  });
  afterEach(() => jest.useRealTimers());

  it("draws the day's events by their time, and the all-day ones over the grid", async () => {
    const onEventPress = jest.fn();
    await render(<Timeline events={EVENTS} defaultDate={at(9, 0)} locale="en-US" format="12h" onEventPress={onEventPress} />);
    expect(screen.getByLabelText('Standup, 9:00 AM – 9:30 AM')).toBeTruthy();
    expect(screen.getByLabelText('Design review, 9:15 AM – 10:00 AM')).toBeTruthy();
    expect(screen.getByLabelText('Offsite, All day')).toBeTruthy();
    expect(screen.queryByText('Gym')).toBeNull();
    expect(screen.getByText('All day')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Standup, 9:00 AM – 9:30 AM'));
    expect(onEventPress).toHaveBeenCalledWith(EVENTS[0]);
  });

  it('shows several days side by side under their dates', async () => {
    const onDayPress = jest.fn();
    await render(<Timeline events={EVENTS} defaultDate={at(9, 0)} numberOfDays={3} locale="en-US" onDayPress={onDayPress} />);
    expect(screen.getByText('Gym')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Wednesday, November 11, 2026'));
    expect(onDayPress).toHaveBeenCalledWith(at(11, 0));
  });

  it('suggests an hour-long slot where the empty grid is tapped', async () => {
    const onSlotPress = jest.fn();
    await render(<Timeline events={[]} defaultDate={at(9, 0)} startHour={8} hourHeight={60} onSlotPress={onSlotPress} testID="timeline" />);
    await fireEvent.press(screen.getByTestId('timeline.2026-11-09'), { nativeEvent: { locationY: 150 } });
    expect(onSlotPress).toHaveBeenCalledWith({ start: at(9, 10, 30), end: at(9, 11, 30) });
  });

  it('labels hours on the clock the format asks for', async () => {
    await render(<Timeline events={[]} defaultDate={at(9, 0)} locale="en-GB" format="24h" design="material" />);
    expect(screen.getByText('13:00', { includeHiddenElements: true })).toBeTruthy();
    // Google Calendar leaves the lines at the top and the bottom unlabelled.
    expect(screen.queryByText('00:00', { includeHiddenElements: true })).toBeNull();
  });

  it("shows iOS's pill with the current time when today is shown", async () => {
    await render(
      <PickersProvider design="ios">
        <Timeline events={[]} defaultDate={at(9, 0)} locale="en-US" format="12h" />
      </PickersProvider>
    );
    expect(screen.getByText('12:00', { includeHiddenElements: true })).toBeTruthy();
  });

  it('draws a custom event', async () => {
    await render(
      <Timeline events={EVENTS} defaultDate={at(9, 0)} locale="en-US" renderEvent={({ event }) => <Text>{`${event.title}!`}</Text>} />
    );
    expect(screen.getByText('Standup!')).toBeTruthy();
  });

  it('follows a date set from outside, without calling onDateChange', async () => {
    const onDateChange = jest.fn();
    const { rerender } = await render(<Timeline events={EVENTS} date={at(9, 0)} onDateChange={onDateChange} />);
    expect(screen.queryByText('Gym')).toBeNull();
    await rerender(<Timeline events={EVENTS} date={at(10, 0)} onDateChange={onDateChange} />);
    expect(screen.getByText('Gym')).toBeTruthy();
    expect(onDateChange).not.toHaveBeenCalled();
  });
});
