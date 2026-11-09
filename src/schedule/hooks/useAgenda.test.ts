import { act, renderHook } from '@testing-library/react-native';

import type { AgendaProps, ScheduleEvent } from '../schedule.types';
import { useAgenda } from './useAgenda';

const at = (day: number, hour: number) => new Date(2026, 10, day, hour);
const EVENTS: ScheduleEvent[] = [
  { id: 'a', title: 'A', start: at(9, 9), end: at(9, 10) },
  { id: 'b', title: 'B', start: at(12, 9), end: at(12, 10) },
];

describe('useAgenda', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const setup = async (props: Partial<AgendaProps> = {}) => {
    const onVisibleDateChange = jest.fn();
    const hook = await renderHook(() =>
      useAgenda({ events: EVENTS, selectedDate: at(9, 0), design: 'material', onVisibleDateChange, ...props })
    );
    const scrollTo = (index: number) => {
      const item = hook.result.current.rows[index];
      hook.result.current.onViewableItemsChanged({ viewableItems: [{ index, item, key: item?.key ?? '', isViewable: true }] });
    };
    return {
      ...hook,
      onVisibleDateChange,
      scrollTo,
    };
  };

  it('reports the day the user scrolls to the top, once per day', async () => {
    const { scrollTo, onVisibleDateChange } = await setup();
    await act(() => jest.advanceTimersByTime(1000));
    scrollTo(1);
    scrollTo(1);
    expect(onVisibleDateChange).toHaveBeenCalledTimes(1);
    expect(onVisibleDateChange).toHaveBeenCalledWith(at(12, 0));
  });

  it("doesn't report the days a scroll to selectedDate passes", async () => {
    const { scrollTo, onVisibleDateChange } = await setup();
    scrollTo(1);
    expect(onVisibleDateChange).not.toHaveBeenCalled();
  });

  it('builds bands for iOS and none elsewhere', async () => {
    expect((await setup({ design: 'ios' })).result.current.headerIndices).toEqual([0, 2]);
    expect((await setup({ design: 'web' })).result.current.headerIndices).toEqual([]);
  });
});
