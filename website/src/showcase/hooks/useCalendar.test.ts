import { act, renderHook } from '@testing-library/react-native';

import { daysFromNowAt } from '../../home/demo/demo.utils';
import { CALENDAR_EVENTS, NEW_EVENT } from '../showcase.constants';
import { useCalendar } from './useCalendar';

describe('useCalendar', () => {
  it('adds an event where an empty hour was tapped, and marks its day', async () => {
    const { result } = await renderHook(() => useCalendar());
    const slot = { start: daysFromNowAt(10, 15), end: daysFromNowAt(10, 16) };
    await act(() => result.current.addEvent(slot));
    expect(result.current.events).toHaveLength(CALENDAR_EVENTS.length + 1);
    expect(result.current.events.at(-1)).toMatchObject({ ...NEW_EVENT, ...slot });
    expect(Object.keys(result.current.marks)).toHaveLength(new Set(result.current.events.map((e) => e.start.toDateString())).size);
  });
});
