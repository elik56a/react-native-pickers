import { Animated } from 'react-native';

import { renderHook } from '@testing-library/react-native';

import { useCaretBlink } from './useCaretBlink';

describe('useCaretBlink', () => {
  afterEach(() => jest.restoreAllMocks());

  it('blinks while visible, restarts when the caret moves, and stops when hidden', async () => {
    const stop = jest.fn();
    const loop = jest.spyOn(Animated, 'loop').mockReturnValue({
      start: jest.fn(),
      stop,
      reset: jest.fn(),
    });
    const { rerender } = await renderHook(
      ({ visible, position }: { visible: boolean; position: number }) => useCaretBlink(visible, position),
      {
        initialProps: { visible: true, position: 0 },
      }
    );
    expect(loop).toHaveBeenCalledTimes(1);
    await rerender({ visible: true, position: 1 });
    expect(stop).toHaveBeenCalledTimes(1);
    expect(loop).toHaveBeenCalledTimes(2);
    await rerender({ visible: false, position: 1 });
    expect(stop).toHaveBeenCalledTimes(2);
    expect(loop).toHaveBeenCalledTimes(2);
  });
});
