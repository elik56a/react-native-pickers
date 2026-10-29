import { act, renderHook } from '@testing-library/react-native';

import { DELIVERY } from '../showcase.constants';
import { useDelivery } from './useDelivery';

const details = (valid: boolean) => ({
  country: DELIVERY.country,
  nationalNumber: '',
  valid,
});

describe('useDelivery', () => {
  it('moves the phone to the shipping country only while there is no number', async () => {
    const { result } = await renderHook(() => useDelivery());
    await act(() => result.current.changeShipTo('FR'));
    expect(result.current.phoneCountry).toBe(DELIVERY.country);
    await act(() => result.current.changePhone('', details(false)));
    await act(() => result.current.changeShipTo('DE'));
    expect(result.current.phoneCountry).toBe('DE');
  });

  it('is ready once the phone number has a valid length', async () => {
    const { result } = await renderHook(() => useDelivery());
    expect(result.current.ready).toBe(true);
    await act(() => result.current.changePhone('+35191', details(false)));
    expect(result.current.ready).toBe(false);
  });
});
