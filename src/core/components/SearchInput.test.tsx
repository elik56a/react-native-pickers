import { StyleSheet } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { lightTheme } from '../theme/theme.constants';
import { SearchInput } from './SearchInput';

const borderColor = () => StyleSheet.flatten(screen.getByLabelText('Search').props.style).borderColor;

describe('SearchInput', () => {
  it('shows focus with the theme primary border', async () => {
    await render(<SearchInput value="" onChangeText={jest.fn()} placeholder="Search" theme={lightTheme} />);
    expect(borderColor()).toBe('transparent');
    await fireEvent(screen.getByLabelText('Search'), 'focus');
    expect(borderColor()).toBe(lightTheme.colors.primary);
    await fireEvent(screen.getByLabelText('Search'), 'blur');
    expect(borderColor()).toBe('transparent');
  });

  it('tints on hover, but not while focused', async () => {
    const boxShadow = () => StyleSheet.flatten(screen.getByLabelText('Search').props.style).boxShadow;
    await render(<SearchInput value="" onChangeText={jest.fn()} placeholder="Search" theme={lightTheme} />);
    expect(boxShadow()).toBeUndefined();
    await fireEvent(screen.getByLabelText('Search'), 'pointerEnter');
    expect(boxShadow()).toContain(lightTheme.colors.hover);
    await fireEvent(screen.getByLabelText('Search'), 'focus');
    expect(boxShadow()).toBeUndefined();
    await fireEvent(screen.getByLabelText('Search'), 'blur');
    await fireEvent(screen.getByLabelText('Search'), 'pointerLeave');
    expect(boxShadow()).toBeUndefined();
  });
});
