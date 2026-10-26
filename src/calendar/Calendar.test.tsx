import { fireEvent, render, screen } from '@testing-library/react-native';

import { toDateKey } from '../core/utils/date.utils';
import { Calendar } from './Calendar';
import type { DateRange } from './calendar.types';

const OCTOBER = new Date(2026, 9, 1);
const dayCell = (d: number, month = 'October') => screen.getByLabelText(new RegExp(`${month} ${d}, 2026`));
const pressDay = (d: number) => fireEvent.press(dayCell(d));
const rangeKeys = (range: DateRange) => [range.start && toDateKey(range.start), range.end && toDateKey(range.end)];

describe('Calendar', () => {
  it('selects a single day', async () => {
    const onChange = jest.fn();
    await render(<Calendar initialMonth={OCTOBER} onChange={onChange} />);
    await pressDay(15);
    expect(toDateKey(onChange.mock.calls[0][0])).toBe('2026-10-15');
    expect(dayCell(15).props.accessibilityState).toMatchObject({ selected: true });
  });

  it('builds a range from two taps', async () => {
    const onChange = jest.fn();
    await render(<Calendar mode="range" initialMonth={OCTOBER} onChange={onChange} />);
    await pressDay(10);
    await pressDay(14);
    expect(onChange.mock.calls.map(([range]) => rangeKeys(range))).toEqual([
      ['2026-10-10', null],
      ['2026-10-10', '2026-10-14'],
    ]);
  });

  it('builds several ranges and removes one when tapped', async () => {
    const onChange = jest.fn();
    await render(<Calendar mode="ranges" initialMonth={OCTOBER} onChange={onChange} />);
    await pressDay(3);
    await pressDay(5);
    await pressDay(20);
    await pressDay(22);
    expect(onChange.mock.calls[3][0].map(rangeKeys)).toEqual([
      ['2026-10-03', '2026-10-05'],
      ['2026-10-20', '2026-10-22'],
    ]);
    await pressDay(4);
    expect(onChange.mock.calls[4][0].map(rangeKeys)).toEqual([['2026-10-20', '2026-10-22']]);
  });

  it('stops adding days at maxSelections in multiple mode', async () => {
    const onChange = jest.fn();
    await render(<Calendar mode="multiple" maxSelections={2} initialMonth={OCTOBER} onChange={onChange} />);
    await pressDay(3);
    await pressDay(7);
    await pressDay(9);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0].map(toDateKey)).toEqual(['2026-10-03', '2026-10-07']);
  });

  it('ignores disabled days', async () => {
    const onChange = jest.fn();
    await render(<Calendar initialMonth={OCTOBER} minDate={new Date(2026, 9, 12)} onChange={onChange} />);
    await pressDay(11);
    expect(onChange).not.toHaveBeenCalled();
    expect(dayCell(11).props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('pages months with the arrows and respects minDate', async () => {
    const onMonthChange = jest.fn();
    await render(<Calendar initialMonth={OCTOBER} minDate={new Date(2026, 9, 5)} onMonthChange={onMonthChange} />);
    expect(screen.getByLabelText('Previous').props.accessibilityState).toMatchObject({ disabled: true });
    await fireEvent.press(screen.getByLabelText('Next'));
    expect(screen.getByText('November 2026')).toBeTruthy();
    expect(onMonthChange.mock.calls[0][0].getMonth()).toBe(10);
  });

  it('jumps to a month through the title', async () => {
    const onMonthChange = jest.fn();
    await render(<Calendar initialMonth={OCTOBER} onMonthChange={onMonthChange} />);
    await fireEvent.press(screen.getByText('October 2026'));
    expect(screen.getByText('2026')).toBeTruthy();
    await fireEvent.press(screen.getByText('Mar'));
    expect(screen.getByText('March 2026')).toBeTruthy();
    expect(onMonthChange.mock.calls[0][0].getMonth()).toBe(2);
  });

  it('follows a controlled value into another month', async () => {
    const { rerender } = await render(<Calendar value={new Date(2026, 9, 15)} />);
    expect(screen.getByText('October 2026')).toBeTruthy();
    await rerender(<Calendar value={new Date(2027, 0, 5)} />);
    expect(screen.getByText('January 2027')).toBeTruthy();
  });

  it('renders marked date labels', async () => {
    await render(<Calendar initialMonth={OCTOBER} markedDates={{ '2026-10-30': { label: '$89' } }} />);
    expect(screen.getByText('$89')).toBeTruthy();
  });
});
