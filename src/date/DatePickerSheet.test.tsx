import { fireEvent, render, screen } from '@testing-library/react-native';

import { toDateKey } from '../core';
import { DatePickerSheet } from './DatePickerSheet';
import type { DatePickerSheetProps } from './date.types';

const OCTOBER = new Date(2026, 9, 1);
const pressDay = (d: number) => fireEvent.press(screen.getByLabelText(new RegExp(`October ${d}, 2026`)));
const done = () => screen.getByRole('button', { name: 'Done' });

describe('DatePickerSheet', () => {
  it('confirms the picked day only after Done', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await render(<DatePickerSheet visible onClose={onClose} onConfirm={onConfirm} initialMonth={OCTOBER} />);
    expect(done().props.accessibilityState).toMatchObject({ disabled: true });
    await pressDay(15);
    expect(onConfirm).not.toHaveBeenCalled();
    await fireEvent.press(done());
    expect(toDateKey(onConfirm.mock.calls[0][0])).toBe('2026-10-15');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows the picked day in large type above the calendar in the Material design only', async () => {
    const { rerender } = await render(
      <DatePickerSheet visible onClose={jest.fn()} onConfirm={jest.fn()} initialMonth={OCTOBER} design="material" />
    );
    expect(screen.getByRole('header', { name: 'Selected date' })).toBeTruthy();
    await pressDay(15);
    expect(screen.getByRole('header', { name: 'Thu, Oct 15' })).toBeTruthy();
    await rerender(<DatePickerSheet visible onClose={jest.fn()} onConfirm={jest.fn()} initialMonth={OCTOBER} design="ios" />);
    expect(screen.queryByRole('header', { name: /Oct 15/ })).toBeNull();
  });

  it('confirms a range picked from a preset', async () => {
    const onConfirm = jest.fn();
    const presets = [{ label: 'Week one', start: new Date(2026, 9, 1), end: new Date(2026, 9, 7) }];
    await render(
      <DatePickerSheet visible mode="range" onClose={jest.fn()} onConfirm={onConfirm} initialMonth={OCTOBER} presets={presets} />
    );
    await fireEvent.press(screen.getByRole('radio', { name: 'Week one' }));
    await fireEvent.press(done());
    const { start, end } = onConfirm.mock.calls[0][0];
    expect([toDateKey(start), toDateKey(end)]).toEqual(['2026-10-01', '2026-10-07']);
  });

  it('confirms on tap with confirmOnSelect', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await render(<DatePickerSheet visible onClose={onClose} onConfirm={onConfirm} initialMonth={OCTOBER} confirmOnSelect />);
    expect(screen.queryByRole('button', { name: 'Done' })).toBeNull();
    await pressDay(3);
    expect(toDateKey(onConfirm.mock.calls[0][0])).toBe('2026-10-03');
    expect(onClose).toHaveBeenCalled();
  });

  it('waits for a full range before enabling Done', async () => {
    const onConfirm = jest.fn();
    await render(<DatePickerSheet visible mode="range" onClose={jest.fn()} onConfirm={onConfirm} initialMonth={OCTOBER} />);
    await pressDay(10);
    expect(done().props.accessibilityState).toMatchObject({ disabled: true });
    await pressDay(14);
    await fireEvent.press(done());
    const range = onConfirm.mock.calls[0][0];
    expect([toDateKey(range.start), toDateKey(range.end)]).toEqual(['2026-10-10', '2026-10-14']);
  });

  it.each([
    ['range', { start: null, end: null }],
    ['multiple', []],
  ] as const)('shows the calendar for %s mode even with display="wheel"', async (mode, value) => {
    const props = { mode, value, onConfirm: jest.fn() } as unknown as DatePickerSheetProps;
    await render(<DatePickerSheet {...props} visible display="wheel" onClose={jest.fn()} initialMonth={OCTOBER} />);
    expect(screen.getByLabelText(/October 15, 2026/)).toBeTruthy();
  });

  it('starts a new draft when the mode changes while open', async () => {
    const onConfirm = jest.fn();
    const range = { start: new Date(2026, 9, 10), end: new Date(2026, 9, 14) };
    const { rerender } = await render(
      <DatePickerSheet visible mode="range" value={range} onClose={jest.fn()} onConfirm={onConfirm} initialMonth={OCTOBER} />
    );
    await rerender(<DatePickerSheet visible mode="multiple" value={[]} onClose={jest.fn()} onConfirm={onConfirm} initialMonth={OCTOBER} />);
    await pressDay(3);
    await fireEvent.press(done());
    expect(onConfirm.mock.calls[0][0].map(toDateKey)).toEqual(['2026-10-03']);
  });

  it("reads the new draft in the same render the mode changes, so no mode sees another mode's value", async () => {
    const range = { start: new Date(2026, 9, 10), end: new Date(2026, 9, 14) };
    const { rerender } = await render(
      <DatePickerSheet visible mode="range" value={range} onClose={jest.fn()} onConfirm={jest.fn()} initialMonth={OCTOBER} />
    );
    await rerender(<DatePickerSheet visible mode="ranges" value={[]} onClose={jest.fn()} onConfirm={jest.fn()} initialMonth={OCTOBER} />);
    expect(done()).toBeTruthy();
  });

  it('starts a new draft when the mode changes while closed, since a field keeps its sheet mounted', async () => {
    const range = { start: new Date(2026, 9, 10), end: new Date(2026, 9, 14) };
    const { rerender } = await render(
      <DatePickerSheet visible={false} mode="range" value={range} onClose={jest.fn()} onConfirm={jest.fn()} initialMonth={OCTOBER} />
    );
    await rerender(
      <DatePickerSheet visible={false} mode="ranges" value={[]} onClose={jest.fn()} onConfirm={jest.fn()} initialMonth={OCTOBER} />
    );
    await rerender(<DatePickerSheet visible mode="ranges" value={[]} onClose={jest.fn()} onConfirm={jest.fn()} initialMonth={OCTOBER} />);
    expect(done()).toBeTruthy();
  });
});
