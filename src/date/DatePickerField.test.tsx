import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import type { DateRange } from '../calendar/calendar.types';
import { DatePickerField } from './DatePickerField';

const OCTOBER = new Date(2026, 9, 1);
const pressDay = (d: number) => fireEvent.press(screen.getByLabelText(new RegExp(`October ${d}, 2026`)));

describe('DatePickerField', () => {
  it('opens the sheet titled by the label and confirms the picked day', async () => {
    const onConfirm = jest.fn();
    await render(
      <DatePickerField
        label="Due"
        presentation="bottomSheet"
        locale="en-US"
        placeholder="Pick a day"
        initialMonth={OCTOBER}
        onConfirm={onConfirm}
      />
    );
    expect(screen.getByText('Pick a day')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Due' }));
    expect(screen.getAllByText('Due')).toHaveLength(2);
    await pressDay(15);
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm.mock.calls[0][0]).toEqual(new Date(2026, 9, 15));
  });

  it('shows a range in the field', async () => {
    const onConfirm = jest.fn((range: DateRange) => range);
    await render(
      <DatePickerField
        mode="range"
        locale="en-US"
        value={{ start: new Date(2026, 9, 5), end: new Date(2026, 9, 9) }}
        onConfirm={onConfirm}
      />
    );
    expect(screen.getByText('Oct 5, 2026 – Oct 9, 2026')).toBeTruthy();
  });

  it('prefers displayValue over the formatted value', async () => {
    await render(<DatePickerField value={new Date(2026, 9, 5)} displayValue="Tomorrow" onConfirm={jest.fn()} />);
    expect(screen.getByText('Tomorrow')).toBeTruthy();
  });

  describe('dropdown (the default)', () => {
    // The preset's View mock shares these instance methods; measureInWindow never calls back unless told to.
    const { measureInWindow }: { measureInWindow: jest.Mock } = jest.requireActual(
      '@react-native/jest-preset/jest/MockNativeMethods'
    ).default;
    beforeEach(() => measureInWindow.mockImplementation((callback: (...rect: number[]) => void) => callback(16, 100, 300, 48)));
    afterEach(() => measureInWindow.mockReset());

    it('opens under the field without a title, and confirms with Done', async () => {
      const onConfirm = jest.fn();
      await render(<DatePickerField label="Due" locale="en-US" initialMonth={OCTOBER} onConfirm={onConfirm} />);
      await fireEvent.press(screen.getByRole('button', { name: 'Due' }));
      expect(screen.getAllByText('Due')).toHaveLength(1);
      await pressDay(15);
      await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
      expect(onConfirm.mock.calls[0][0]).toEqual(new Date(2026, 9, 15));
      await waitFor(() => expect(screen.queryByRole('button', { name: 'Done' })).toBeNull());
    });

    it('closes without confirming on Cancel', async () => {
      const onConfirm = jest.fn();
      await render(<DatePickerField label="Due" locale="en-US" initialMonth={OCTOBER} onConfirm={onConfirm} />);
      await fireEvent.press(screen.getByRole('button', { name: 'Due' }));
      await pressDay(15);
      await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
