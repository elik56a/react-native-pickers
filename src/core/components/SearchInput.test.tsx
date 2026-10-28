import { StyleSheet } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { PickersProvider } from '../theme/ThemeProvider';
import { lightTheme } from '../theme/theme.constants';
import type { Design } from '../theme/theme.types';
import { SearchInput } from './SearchInput';

const inputStyle = () => StyleSheet.flatten(screen.getByLabelText('Search').props.style);
const themed = (design: Design) => ({
  ...lightTheme,
  design,
});

describe('SearchInput', () => {
  it('draws each design: a short gray bar on iOS, a tall pill in Material, an outlined input on the web', async () => {
    await render(<SearchInput value="" onChangeText={jest.fn()} placeholder="Search" theme={themed('ios')} />);
    expect(inputStyle()).toMatchObject({ height: 36, backgroundColor: lightTheme.colors.surface, borderColor: 'transparent' });
    await render(<SearchInput value="" onChangeText={jest.fn()} placeholder="Search" theme={themed('material')} />);
    expect(inputStyle()).toMatchObject({ height: 48, borderRadius: lightTheme.radius.full });
    await render(<SearchInput value="" onChangeText={jest.fn()} placeholder="Search" theme={themed('web')} />);
    expect(inputStyle()).toMatchObject({ backgroundColor: lightTheme.colors.background, borderColor: lightTheme.colors.border });
  });

  it('rings focus in primary on the web design, and only relies on the caret on iOS', async () => {
    await render(<SearchInput value="" onChangeText={jest.fn()} placeholder="Search" theme={themed('web')} />);
    await fireEvent(screen.getByLabelText('Search'), 'focus');
    expect(inputStyle().borderColor).toBe(lightTheme.colors.primary);
    await fireEvent(screen.getByLabelText('Search'), 'blur');
    expect(inputStyle().borderColor).toBe(lightTheme.colors.border);
    await render(<SearchInput value="" onChangeText={jest.fn()} placeholder="Search" theme={themed('ios')} />);
    await fireEvent(screen.getByLabelText('Search'), 'focus');
    expect(inputStyle().borderColor).toBe('transparent');
  });

  it('keeps the focus ring for keyboard users on the web, whatever the design', async () => {
    await render(
      <PickersProvider platform="web">
        <SearchInput value="" onChangeText={jest.fn()} placeholder="Search" theme={themed('ios')} />
      </PickersProvider>
    );
    await fireEvent(screen.getByLabelText('Search'), 'focus');
    expect(inputStyle().borderColor).toBe(lightTheme.colors.primary);
  });

  it('tints on hover, but not while focused', async () => {
    const boxShadow = () => inputStyle().boxShadow;
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
