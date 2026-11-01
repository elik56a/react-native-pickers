import { fireEvent, render, screen } from '@testing-library/react-native';

import { LanguagePicker } from './LanguagePicker';

describe('LanguagePicker', () => {
  it('shows the selected language in itself', async () => {
    await render(<LanguagePicker label="Language" value="ja" locale="en" />);
    expect(screen.getByText('日本語')).toBeTruthy();
  });

  it('finds a language by its name in the locale and selects it', async () => {
    const onChange = jest.fn();
    await render(<LanguagePicker label="Language" locale="en" onChange={onChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Language' }));
    await fireEvent.changeText(screen.getByLabelText('Search languages'), 'spanish');
    await fireEvent.press(screen.getByText('Español'));
    expect(onChange).toHaveBeenCalledWith('es', expect.objectContaining({ value: 'es', label: 'Español' }));
  });

  it('shows the flag of the country a language stands for, hidden from screen readers, which flags can change or showFlag hide', async () => {
    const { rerender } = await render(<LanguagePicker label="Language" value="es" locale="en" />);
    expect(screen.getByText('🇪🇸', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText('🇪🇸')).toBeNull();
    await rerender(<LanguagePicker label="Language" value="en" locale="en" flags={{ en: 'GB' }} />);
    expect(screen.getByText('🇬🇧', { includeHiddenElements: true })).toBeTruthy();
    await rerender(<LanguagePicker label="Language" value="en" locale="en" showFlag={false} />);
    expect(screen.queryByText('🇺🇸', { includeHiddenElements: true })).toBeNull();
  });

  it('lists preferred languages first under their header', async () => {
    await render(<LanguagePicker label="Language" locale="en" preferred={['en', 'he']} preferredLabel="On this device" />);
    await fireEvent.press(screen.getByRole('button', { name: 'Language' }));
    expect(screen.getByText('On this device')).toBeTruthy();
    expect(screen.getByText('All languages')).toBeTruthy();
  });
});
