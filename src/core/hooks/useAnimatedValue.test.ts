import type { Animated } from 'react-native';

import { renderHook } from '@testing-library/react-native';

import { useAnimatedValue } from './useAnimatedValue';

const currentValue = (value: Animated.Value) => (value as unknown as { __getValue: () => number }).__getValue();

describe('useAnimatedValue', () => {
  it('keeps one value for the lifetime, starting at the initial number', async () => {
    const { result, rerender } = await renderHook(({ initial }: { initial: number }) => useAnimatedValue(initial), {
      initialProps: { initial: 3 },
    });
    const first = result.current;
    expect(currentValue(first)).toBe(3);
    await rerender({ initial: 5 });
    expect(result.current).toBe(first);
    expect(currentValue(result.current)).toBe(3);
  });
});
