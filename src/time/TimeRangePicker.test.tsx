import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { TimeRangePicker } from './TimeRangePicker';
import { TimeRangePickerField } from './TimeRangePickerField';
import type { TimeRange } from './time.types';

const at = (h: number, m = 0, d = 25) => new Date(2026, 9, d, h, m);
const WORK_DAY: TimeRange = { start: at(9), end: at(17) };
const span = ({ start, end }: TimeRange) => [start.getHours(), start.getMinutes(), end.getHours(), end.getMinutes(), end.getDate()];

describe('TimeRangePicker', () => {
  const renderPicker = (props: Partial<React.ComponentProps<typeof TimeRangePicker>> = {}) =>
    render(<TimeRangePicker value={WORK_DAY} format="24h" locale="en-US" design="web" {...props} />);

  it('switches between Start and End, each showing its time, and edits the start first', async () => {
    await renderPicker();
    expect(screen.getByRole('radio', { name: 'Start 09:00' }).props.accessibilityState).toMatchObject({ checked: true });
    expect(screen.getByRole('radio', { name: 'End 17:00' })).toBeTruthy();
    expect(screen.getByLabelText('Hour 09').props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByRole('radio', { name: 'End 17:00' }));
    expect(screen.getByLabelText('Hour 17').props.accessibilityState).toMatchObject({ selected: true });
  });

  it('shows the ends as rows on iOS, folding the wheels closed under one and open under the other', async () => {
    await renderPicker({ design: 'ios', testID: 'hours' });
    expect(screen.getByTestId('hours-start')).toBeTruthy();
    await fireEvent.press(screen.getByRole('radio', { name: 'End 17:00' }));
    expect(screen.getByTestId('hours-end')).toBeTruthy();
    await waitFor(() => expect(screen.queryByTestId('hours-start')).toBeNull());
  });

  it('carries the end along when the start moves', async () => {
    const onChange = jest.fn();
    await renderPicker({ onChange });
    await fireEvent.press(screen.getByLabelText('Hour 10'));
    expect(span(onChange.mock.calls[0][0])).toEqual([10, 0, 18, 0, 25]);
  });

  it('puts an earlier end on the next day and marks it +1', async () => {
    const onChange = jest.fn();
    const { rerender } = await renderPicker({ value: { start: at(22), end: at(23) }, onChange });
    await fireEvent.press(screen.getByRole('radio', { name: 'End 23:00' }));
    await fireEvent.press(screen.getByLabelText('Hour 21'));
    const overnight = onChange.mock.calls[0][0];
    expect(span(overnight)).toEqual([22, 0, 21, 0, 26]);
    await rerender(<TimeRangePicker value={overnight} format="24h" locale="en-US" design="web" />);
    expect(screen.getByRole('radio', { name: 'End 21:00 +1' })).toBeTruthy();
  });

  it('keeps the end after the start and within minDuration when the range may not run overnight', async () => {
    const onChange = jest.fn();
    await renderPicker({
      value: { start: at(15), end: at(17) },
      onChange,
      allowOvernight: false,
      minDuration: 60,
      startLabel: 'From',
      endLabel: 'To',
    });
    await fireEvent.press(screen.getByRole('radio', { name: 'To 17:00' }));
    await fireEvent.press(screen.getByLabelText('Hour 14'));
    expect(span(onChange.mock.calls[0][0])).toEqual([15, 0, 16, 0, 25]);
  });
});

describe('TimeRangePickerField', () => {
  it('shows the range and confirms the one picked in the sheet', async () => {
    const onConfirm = jest.fn();
    await render(
      <TimeRangePickerField label="Opening hours" format="24h" locale="en-US" design="web" value={WORK_DAY} onConfirm={onConfirm} />
    );
    expect(screen.getByText('09:00 – 17:00')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Opening hours' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'End 17:00' }));
    await fireEvent.press(screen.getByLabelText('Hour 18'));
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(span(onConfirm.mock.calls[0][0])).toEqual([9, 0, 18, 0, 25]);
  });
});
