import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react-native';

import { PickersProvider, useComponentTheme, useDesignOverride, usePickerTheme } from './ThemeProvider';
import type { PickersProviderProps } from './theme.types';

const inProvider = (props: Omit<PickersProviderProps, 'children'>) => ({
  wrapper: ({ children }: { children: ReactNode }) => <PickersProvider {...props}>{children}</PickersProvider>,
});

describe('usePickerTheme', () => {
  it('draws the design that matches the platform, with its tokens', async () => {
    const { result } = await renderHook(() => usePickerTheme(), inProvider({ platform: 'android' }));
    expect(result.current.design).toBe('material');
    expect(result.current.radius.sheet).toBe(28);
  });

  it('defaults to the iOS look outside a provider in the iOS test environment', async () => {
    const { result } = await renderHook(() => usePickerTheme());
    expect(result.current.design).toBe('ios');
    expect(result.current.radius.sheet).toBe(24);
  });

  it('lets the provider choose a design for every platform', async () => {
    const { result } = await renderHook(() => usePickerTheme(), inProvider({ platform: 'android', design: 'ios' }));
    expect(result.current.design).toBe('ios');
  });

  it('lets a component override the provider, and keeps theme overrides over the design tokens', async () => {
    const theme = { radius: { sheet: 4 } };
    const { result } = await renderHook(() => usePickerTheme({ design: 'web' }), inProvider({ design: 'material', theme }));
    expect(result.current.design).toBe('web');
    expect(result.current.radius).toMatchObject({ sheet: 4, md: 8 });
  });
});

describe('useDesignOverride', () => {
  it('adds the design to the theme override, and leaves the override alone without one', async () => {
    const theme = { radius: { sm: 2 } };
    const withDesign = await renderHook(() => useDesignOverride(theme, 'material'));
    expect(withDesign.result.current).toEqual({ radius: { sm: 2 }, design: 'material' });
    const without = await renderHook(() => useDesignOverride(theme, undefined));
    expect(without.result.current).toBe(theme);
  });
});

describe('useComponentTheme', () => {
  it("draws with the component's design and gives its parts the override with that design", async () => {
    const theme = { radius: { sm: 2 } };
    const { result } = await renderHook(() => useComponentTheme(theme, 'web'), inProvider({ design: 'material' }));
    expect(result.current.theme).toMatchObject({ design: 'web', radius: { sm: 2 } });
    expect(result.current.themeOverride).toEqual({ radius: { sm: 2 }, design: 'web' });
  });
});
