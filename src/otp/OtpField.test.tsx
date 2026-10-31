import { fireEvent, render, screen } from '@testing-library/react-native';

import { OtpField } from './OtpField';

const input = () => screen.getByLabelText('Verification code');
const cellText = (index: number) => screen.getByTestId(`otp-cell-${index}`, { includeHiddenElements: true });

describe('OtpField', () => {
  it('reports what is typed and completes on the last character', async () => {
    const onChange = jest.fn();
    const onComplete = jest.fn();
    await render(<OtpField length={4} onChange={onChange} onComplete={onComplete} testID="otp" />);
    await fireEvent.changeText(input(), '12');
    expect(onChange).toHaveBeenLastCalledWith('12');
    expect(onComplete).not.toHaveBeenCalled();
    await fireEvent.changeText(input(), '1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
    expect(cellText(3)).toHaveTextContent('4');
  });

  it('shows the helper text, replaced by the error message, which screen readers hear on the field', async () => {
    const { rerender } = await render(<OtpField helperText="Sent to •••• 0123" />);
    expect(screen.getByText('Sent to •••• 0123')).toBeTruthy();
    await rerender(<OtpField helperText="Sent to •••• 0123" error="That code didn’t match" />);
    expect(screen.queryByText('Sent to •••• 0123')).toBeNull();
    expect(screen.getByText('That code didn’t match')).toBeTruthy();
    expect(input().props.accessibilityHint).toBe('That code didn’t match');
  });

  it('takes the code out of a pasted message and ignores letters on a numeric field', async () => {
    const onChange = jest.fn();
    await render(<OtpField onChange={onChange} />);
    await fireEvent.changeText(input(), 'Your code is 482-913');
    expect(onChange).toHaveBeenLastCalledWith('482913');
    onChange.mockClear();
    await fireEvent.changeText(input(), '482913x');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows dots when secure', async () => {
    await render(<OtpField length={4} defaultValue="12" secureTextEntry testID="otp" />);
    expect(cellText(0)).toHaveTextContent('•');
    expect(cellText(1)).toHaveTextContent('•');
  });

  it('follows a controlled value without reporting it back', async () => {
    const onChange = jest.fn();
    const onComplete = jest.fn();
    const { rerender } = await render(<OtpField length={4} value="" onChange={onChange} onComplete={onComplete} testID="otp" />);
    await rerender(<OtpField length={4} value="5678" onChange={onChange} onComplete={onComplete} testID="otp" />);
    expect(input().props.value).toBe('5678');
    expect(onChange).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('offers the code from a text message on a number pad', async () => {
    await render(<OtpField />);
    expect(input().props).toMatchObject({ textContentType: 'oneTimeCode', keyboardType: 'number-pad', maxLength: 6 });
  });
});
