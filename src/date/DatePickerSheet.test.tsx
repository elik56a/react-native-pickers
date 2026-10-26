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
});
