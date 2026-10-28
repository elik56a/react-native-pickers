import type { Animated as AnimatedType } from 'react-native';
import { Animated } from 'react-native';

import { renderHook } from '@testing-library/react-native';

import { useAnimatedToggle } from './useAnimatedToggle';

const currentValue = (value: AnimatedType.Value) => (value as unknown as { __getValue: () => number }).__getValue();

describe('useAnimatedToggle', () => {
  afterEach(() => jest.restoreAllMocks());

  it('starts where `on` is, and animates to 1 or 0 as it changes', async () => {
    const spy = jest.spyOn(Animated, 'timing');
    const { result, rerender } = await renderHook(({ on }: { on: boolean }) => useAnimatedToggle(on, 120), {
      initialProps: { on: true },
    });
    expect(currentValue(result.current)).toBe(1);
    await rerender({ on: false });
    expect(spy).toHaveBeenLastCalledWith(result.current, expect.objectContaining({ toValue: 0, duration: 120 }));
    await rerender({ on: true });
    expect(spy).toHaveBeenLastCalledWith(result.current, expect.objectContaining({ toValue: 1, duration: 120 }));
  });
});
