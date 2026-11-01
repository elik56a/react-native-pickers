import { act, renderHook } from '@testing-library/react-native';

import { useStoreForm } from './useStoreForm';

describe('useStoreForm', () => {
  it("offers the country's states and the state's cities, and clears the choices below a changed one", async () => {
    const { result } = await renderHook(() => useStoreForm());
    expect(result.current.cityOptions).toEqual([]);
    await act(() => result.current.setState('Texas'));
    await act(() => result.current.setCity('Austin'));
    expect(result.current.cityOptions.map((o) => o.value)).toContain('Austin');
    await act(() => result.current.setCountry('CA'));
    expect(result.current.values).toMatchObject({ country: 'CA', state: null, city: null });
    expect(result.current.stateOptions.map((o) => o.value)).toEqual(['Ontario', 'Quebec', 'British Columbia']);
  });

  it('adds a created tag to the options', async () => {
    const { result } = await renderHook(() => useStoreForm());
    await act(() => {
      result.current.createTag('Brunch');
    });
    expect(result.current.tagOptions).toContainEqual({ label: 'Brunch', value: 'Brunch' });
  });
});
