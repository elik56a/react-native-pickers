import { act, renderHook } from '@testing-library/react-native';

import { HERO_START } from '../hero.constants';
import { useHeroValues } from './useHeroValues';

describe('useHeroValues', () => {
  it('starts from the hero’s values, sets one at a time, and keeps the same setter', async () => {
    const { result } = await renderHook(() => useHeroValues());
    expect(result.current.values.color).toBe(HERO_START.color);
    const set = result.current.set;
    await act(() => set('color')('#000000'));
    expect(result.current.values.color).toBe('#000000');
    expect(result.current.values.emoji).toBe(HERO_START.emoji);
    expect(result.current.set).toBe(set);
  });
});
