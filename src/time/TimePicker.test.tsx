import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TimePicker } from './TimePicker';

const H = 40;
const at = (h: number, m = 0) => new Date(2026, 9, 25, h, m);
const hhmm = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
const scrollColumn = async (column: string, index: number) => {
  await fireEvent.scroll(screen.getByTestId(`time-${column}-list`), { nativeEvent: { contentOffset: { y: index * H } } });
  await act(() => jest.advanceTimersByTime(500));
};

describe('TimePicker', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('picks from columns of hours and minutes in the web design, keeping the day', async () => {
    const onChange = jest.fn();
    await render(<TimePicker value={at(9, 0)} onChange={onChange} format="24h" minuteInterval={15} design="web" testID="time" />);
    expect(screen.getByLabelText('Hour 09').props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByLabelText('Minute 30'));
    expect(hhmm(onChange.mock.calls[0][0])).toBe('9:30');
    expect(onChange.mock.calls[0][0].getDate()).toBe(25);
    await fireEvent.press(screen.getByLabelText('Hour 14'));
    expect(hhmm(onChange.mock.calls[1][0])).toBe('14:00');
  });

  describe('clock dial', () => {
    /** A tap on the 256-wide dial, `x`, `y` from its top left, for a dial whose top left sits at (100, 200) on the page. */
    const tap = async (x: number, y: number) => {
      const dial = screen.getByTestId('time-dial');
      const touch = { pageX: 100 + x, pageY: 200 + y, locationX: x, locationY: y };
      const touchHistory = {
        numberActiveTouches: 1,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: 1,
        touchBank: [
          {
            touchActive: true,
            startPageX: touch.pageX,
            startPageY: touch.pageY,
            currentPageX: touch.pageX,
            currentPageY: touch.pageY,
            previousPageX: touch.pageX,
            previousPageY: touch.pageY,
            startTimeStamp: 1,
            currentTimeStamp: 1,
            previousTimeStamp: 1,
          },
        ],
      };
      await fireEvent(dial, 'responderGrant', { nativeEvent: touch, touchHistory });
      await fireEvent(dial, 'responderRelease', { nativeEvent: touch, touchHistory });
    };

    it('is the Material default: pick the hour on the dial, then the minutes', async () => {
      const onChange = jest.fn();
      const { rerender } = await render(
        <TimePicker value={at(9, 0)} onChange={onChange} format="12h" dayPeriodLabels={['AM', 'PM']} design="material" testID="time" />
      );
      expect(screen.getByTestId('time-hour').props.accessibilityValue.text).toBe('9');
      await tap(128 + 104, 128);
      expect(hhmm(onChange.mock.calls[0][0])).toBe('3:00');
      await rerender(
        <TimePicker
          value={onChange.mock.calls[0][0]}
          onChange={onChange}
          format="12h"
          dayPeriodLabels={['AM', 'PM']}
          design="material"
          testID="time"
        />
      );
      expect(screen.getByTestId('time-dial').props.accessibilityLabel).toBe('Minute');
      await tap(128, 128 + 104);
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(hhmm(onChange.mock.calls[1][0])).toBe('3:30');
    });

    it('switches AM/PM, steps with a screen reader, and lets the header pick what the dial sets', async () => {
      const onChange = jest.fn();
      await render(
        <TimePicker
          value={at(9, 10)}
          onChange={onChange}
          format="12h"
          dayPeriodLabels={['AM', 'PM']}
          minuteInterval={5}
          design="material"
          testID="time"
        />
      );
      await fireEvent.press(screen.getByText('PM'));
      expect(hhmm(onChange.mock.calls[0][0])).toBe('21:10');
      await fireEvent.press(screen.getByLabelText('Minute'));
      await fireEvent(screen.getByTestId('time-dial'), 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
      expect(hhmm(onChange.mock.calls[1][0])).toBe('9:15');
    });

    it('types the time instead, after switching to the keyboard, and goes back to the dial', async () => {
      const onChange = jest.fn();
      await render(<TimePicker value={at(9, 0)} onChange={onChange} format="24h" design="material" testID="time" />);
      await fireEvent.press(screen.getByLabelText('Type the time'));
      expect(screen.queryByTestId('time-dial')).toBeNull();
      await fireEvent.changeText(screen.getByTestId('time-hour'), '25');
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByTestId('time-hour').props.value).toBe('25');
      await fireEvent.changeText(screen.getByTestId('time-hour'), '14');
      expect(hhmm(onChange.mock.calls[0][0])).toBe('14:00');
      await fireEvent.changeText(screen.getByTestId('time-minute'), '45');
      expect(hhmm(onChange.mock.calls[1][0])).toBe('9:45');
      await fireEvent.press(screen.getByLabelText('Pick the time on the dial'));
      expect(screen.getByTestId('time-dial')).toBeTruthy();
    });

    it('falls back to wheels when seconds show', async () => {
      await render(<TimePicker value={at(9, 0)} design="material" showSeconds testID="time" />);
      expect(screen.queryByTestId('time-dial')).toBeNull();
      expect(screen.getByTestId('time-second')).toBeTruthy();
    });

    it('shows only the typed fields with display="input"', async () => {
      await render(<TimePicker value={at(9, 0)} format="24h" design="material" display="input" testID="time" />);
      expect(screen.queryByTestId('time-dial')).toBeNull();
      expect(screen.queryByLabelText('Pick the time on the dial')).toBeNull();
      expect(screen.getByTestId('time-hour').props.value).toBe('09');
    });
  });

  it('keeps the wheels in the web design with display="wheel"', async () => {
    await render(<TimePicker value={at(9, 5)} format="24h" loop={false} design="web" display="wheel" testID="time" />);
    expect(screen.getByTestId('time-hour')).toBeTruthy();
  });

  it('shows 24h columns with padded hours', async () => {
    await render(<TimePicker value={at(9, 5)} format="24h" loop={false} testID="time" />);
    expect(screen.getByTestId('time-hour').props.accessibilityValue.text).toBe('09');
    expect(screen.getByTestId('time-minute').props.accessibilityValue.text).toBe('05');
    expect(screen.queryByTestId('time-period')).toBeNull();
  });

  it('shows 12h columns with AM/PM', async () => {
    await render(<TimePicker value={at(14, 30)} format="12h" dayPeriodLabels={['AM', 'PM']} loop={false} testID="time" />);
    expect(screen.getByTestId('time-hour').props.accessibilityValue.text).toBe('2');
    expect(screen.getByTestId('time-period').props.accessibilityValue.text).toBe('PM');
  });

  it('commits a new minute and keeps the date', async () => {
    const onChange = jest.fn();
    await render(<TimePicker value={at(10, 30)} format="24h" loop={false} onChange={onChange} testID="time" />);
    await scrollColumn('minute', 45);
    const next: Date = onChange.mock.calls[0][0];
    expect(hhmm(next)).toBe('10:45');
    expect(next.getDate()).toBe(25);
  });

  it('switches AM/PM without changing the hour on the clock face', async () => {
    const onChange = jest.fn();
    await render(
      <TimePicker value={at(14, 30)} format="12h" dayPeriodLabels={['AM', 'PM']} loop={false} onChange={onChange} testID="time" />
    );
    await scrollColumn('period', 0);
    expect(hhmm(onChange.mock.calls[0][0])).toBe('2:30');
  });

  it('clamps a change that lands before minTime', async () => {
    const onChange = jest.fn();
    await render(
      <TimePicker
        value={at(14)}
        minTime={at(10)}
        format="12h"
        dayPeriodLabels={['AM', 'PM']}
        loop={false}
        onChange={onChange}
        testID="time"
      />
    );
    await scrollColumn('period', 0);
    expect(hhmm(onChange.mock.calls[0][0])).toBe('10:00');
  });
});
