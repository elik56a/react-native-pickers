import type { PickerTheme } from './theme.types';

const SHARED_TOKENS: Omit<PickerTheme, 'dark' | 'colors'> = {
  radius: { sm: 8, md: 12, lg: 16, full: 999, sheet: 24 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  typography: {
    sizes: { xs: 11, sm: 13, md: 16, lg: 19, xl: 22 },
    weights: { regular: '400', medium: '500', bold: '600' },
  },
  animation: { duration: 240 },
};

export const lightTheme: PickerTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F4F2EE',
    sheet: '#FFFFFF',
    text: '#17150F',
    textSecondary: '#6E685E',
    textDisabled: '#BDB7AC',
    primary: '#C8460D',
    onPrimary: '#FFFFFF',
    primaryMuted: 'rgba(200,70,13,0.12)',
    border: '#E8E4DC',
    backdrop: 'rgba(23,21,15,0.45)',
    indicator: 'rgba(23,21,15,0.06)',
    handle: '#D8D3C9',
  },
  ...SHARED_TOKENS,
};

export const darkTheme: PickerTheme = {
  dark: true,
  colors: {
    background: '#181612',
    surface: '#24211B',
    sheet: '#1D1B16',
    text: '#F5F2EC',
    textSecondary: '#A39D92',
    textDisabled: '#534E45',
    primary: '#FF7A3D',
    onPrimary: '#17150F',
    primaryMuted: 'rgba(255,122,61,0.18)',
    border: '#2F2B24',
    backdrop: 'rgba(0,0,0,0.6)',
    indicator: 'rgba(255,255,255,0.07)',
    handle: '#3D3930',
  },
  ...SHARED_TOKENS,
};
