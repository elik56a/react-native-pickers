import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { BottomSheet } from './BottomSheet';
import { FieldSheetContext } from './hooks/useFieldSheet';
import { PickerSheet } from './PickerSheet';
import type { FieldSheetContextValue } from './sheet.types';

const inDropdownField: FieldSheetContextValue = {
  presentation: 'dropdown',
  anchor: {
    x: 16,
    y: 100,
    width: 300,
    height: 48,
  },
};

describe('BottomSheet', () => {
  it('renders nothing until visible', async () => {
    const { rerender } = await render(
      <BottomSheet visible={false} onClose={jest.fn()} title="Pick">
        <Text>Body</Text>
      </BottomSheet>
    );
    expect(screen.queryByText('Body')).toBeNull();
    await rerender(
      <BottomSheet visible onClose={jest.fn()} title="Pick">
        <Text>Body</Text>
      </BottomSheet>
    );
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Pick' })).toBeTruthy();
  });

  it('closes on backdrop press unless disabled', async () => {
    const onClose = jest.fn();
    const { rerender } = await render(
      <BottomSheet visible onClose={onClose}>
        <Text>Body</Text>
      </BottomSheet>
    );
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
    await rerender(
      <BottomSheet visible onClose={onClose} closeOnBackdropPress={false}>
        <Text>Body</Text>
      </BottomSheet>
    );
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('PickerSheet', () => {
  it('puts Cancel and Done beside the title on iOS, and Cancel and OK after the content in Material', async () => {
    const sheet = (design: 'ios' | 'material') => (
      <PickerSheet visible onClose={jest.fn()} onConfirm={jest.fn()} title="Pick" design={design}>
        <Text>Body</Text>
      </PickerSheet>
    );
    const { rerender } = await render(sheet('ios'));
    expect(screen.getByRole('button', { name: 'Done' })).toBeTruthy();
    const iosText = screen.getAllByText(/Pick|Body|Cancel|Done/).map((node) => node.props.children);
    expect(iosText).toEqual(['Cancel', 'Pick', 'Done', 'Body']);

    await rerender(sheet('material'));
    const materialText = screen.getAllByText(/Pick|Body|Cancel|OK/).map((node) => node.props.children);
    expect(materialText).toEqual(['Pick', 'Body', 'Cancel', 'OK']);
  });

  it('cancels and confirms from the header', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    await render(
      <PickerSheet visible onClose={onClose} onConfirm={onConfirm} confirmLabel="Save">
        <Text>Body</Text>
      </PickerSheet>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('ignores a disabled confirm and can hide cancel', async () => {
    const onConfirm = jest.fn();
    await render(
      <PickerSheet visible onClose={jest.fn()} onConfirm={onConfirm} confirmDisabled showCancel={false}>
        <Text>Body</Text>
      </PickerSheet>
    );
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe('PickerSheet in a field', () => {
  it('opens as a dropdown under the field: no title, Cancel and Done below the content', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    await render(
      <FieldSheetContext.Provider value={inDropdownField}>
        <PickerSheet visible onClose={onClose} onConfirm={onConfirm} title="Due">
          <Text>Body</Text>
        </PickerSheet>
      </FieldSheetContext.Provider>
    );
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.queryByRole('header', { name: 'Due' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('follows a field set to a sheet presentation', async () => {
    await render(
      <FieldSheetContext.Provider value={{ ...inDropdownField, presentation: 'bottomSheet' }}>
        <PickerSheet visible onClose={jest.fn()} title="Due">
          <Text>Body</Text>
        </PickerSheet>
      </FieldSheetContext.Provider>
    );
    expect(screen.getByRole('header', { name: 'Due' })).toBeTruthy();
  });

  it('keeps its own presentation over the field', async () => {
    await render(
      <FieldSheetContext.Provider value={inDropdownField}>
        <PickerSheet visible onClose={jest.fn()} title="Due" presentation="bottomSheet">
          <Text>Body</Text>
        </PickerSheet>
      </FieldSheetContext.Provider>
    );
    expect(screen.getByRole('header', { name: 'Due' })).toBeTruthy();
  });

  it('does not pass the field on to a sheet opened inside it', async () => {
    await render(
      <FieldSheetContext.Provider value={inDropdownField}>
        <PickerSheet visible onClose={jest.fn()}>
          <PickerSheet visible onClose={jest.fn()} title="Nested">
            <Text>Inner</Text>
          </PickerSheet>
        </PickerSheet>
      </FieldSheetContext.Provider>
    );
    expect(screen.getByRole('header', { name: 'Nested' })).toBeTruthy();
  });
});
