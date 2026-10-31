import { act, renderHook } from '@testing-library/react-native';

import { APPLICATION_ERRORS } from '../showcase.constants';
import { useApplication } from './useApplication';

describe('useApplication', () => {
  it('shows no errors until the user tries to send, then updates them as fields are fixed', async () => {
    const { result } = await renderHook(() => useApplication());
    expect(result.current.errors).toEqual({});
    let sent = true;
    await act(() => {
      sent = result.current.submit();
    });
    expect(sent).toBe(false);
    expect(result.current.errorCount).toBe(6);
    expect(result.current.errors.role).toBe(APPLICATION_ERRORS.role);
    await act(() => result.current.setRole('Data analyst'));
    expect(result.current.errors.role).toBeUndefined();
    expect(result.current.errorCount).toBe(5);
  });

  it('keeps the phone and whether it has a full number', async () => {
    const { result } = await renderHook(() => useApplication());
    await act(() => result.current.changePhone('+35191', { country: 'PT', nationalNumber: '91', valid: false }));
    await act(() => {
      result.current.submit();
    });
    expect(result.current.errors.phone).toBe(APPLICATION_ERRORS.phoneIncomplete);
  });
});
