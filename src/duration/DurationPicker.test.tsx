import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { DurationPicker } from './DurationPicker';

const H = 40;
const scrollColumn = async (column: string, index: number) => {
  await fireEvent.scroll(screen.getByTestId(`duration-${column}-list`), { nativeEvent: { contentOffset: { y: index * H } } });
  await act(() => jest.advanceTimersByTime(500));
};

describe('DurationPicker', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows hours and minutes with their units, and reads them to screen readers', async () => {
    await render(<DurationPicker value={5400} testID="duration" />);
    expect(screen.getByTestId('duration-hours').props.accessibilityValue.text).toBe('1');
    expect(screen.getByTestId('duration-minutes').props.accessibilityValue.text).toBe('30');
    expect(screen.getByLabelText('Hours')).toBeTruthy();
    expect(screen.getByText('h')).toBeTruthy();
    expect(screen.getByText('min')).toBeTruthy();
    expect(screen.queryByTestId('duration-seconds')).toBeNull();
  });

  it('reports the new duration in seconds', async () => {
    const onChange = jest.fn();
    await render(<DurationPicker value={5400} loop={false} onChange={onChange} testID="duration" />);
    await scrollColumn('minutes', 45);
    expect(onChange).toHaveBeenLastCalledWith(3600 + 45 * 60);
    await scrollColumn('hours', 2);
    expect(onChange).toHaveBeenLastCalledWith(2 * 3600 + 30 * 60);
  });

  it('clamps a change that lands below min', async () => {
    const onChange = jest.fn();
    await render(<DurationPicker value={3600 + 10 * 60} min={30 * 60} loop={false} onChange={onChange} testID="duration" />);
    await scrollColumn('hours', 0);
    expect(onChange).toHaveBeenLastCalledWith(30 * 60);
  });

  it('counts minutes and seconds without hours', async () => {
    const onChange = jest.fn();
    await render(<DurationPicker defaultValue={90} showHours={false} showSeconds loop={false} onChange={onChange} testID="duration" />);
    expect(screen.queryByTestId('duration-hours')).toBeNull();
    await scrollColumn('seconds', 45);
    expect(onChange).toHaveBeenLastCalledWith(60 + 45);
  });

  it('types the numbers into boxes in the Material design, ignoring what is not a step yet', async () => {
    const onChange = jest.fn();
    await render(<DurationPicker value={5400} minuteInterval={15} onChange={onChange} design="material" testID="duration" />);
    expect(screen.getByLabelText('Hours').props.value).toBe('1');
    await fireEvent(screen.getByTestId('duration-minutes'), 'focus');
    await fireEvent.changeText(screen.getByTestId('duration-minutes'), '4');
    expect(onChange).not.toHaveBeenCalled();
    await fireEvent.changeText(screen.getByTestId('duration-minutes'), '45');
    expect(onChange).toHaveBeenLastCalledWith(3600 + 45 * 60);
  });

  it('picks from columns of cells under their units in the web design', async () => {
    const onChange = jest.fn();
    await render(<DurationPicker value={5400} minuteInterval={15} onChange={onChange} design="web" testID="duration" />);
    expect(screen.getByLabelText('Hours 1').props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByText('min', { includeHiddenElements: true })).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Minutes 45'));
    expect(onChange).toHaveBeenLastCalledWith(3600 + 45 * 60);
  });
});
