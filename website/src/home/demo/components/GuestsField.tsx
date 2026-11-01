import type { BottomSheetProps } from '@elik56a/react-native-pickers';
import { MultiWheelPicker, PickerField, PickerSheet, useDraft } from '@elik56a/react-native-pickers';
import type { TabOptions } from '../../playground/playground.types';
import { BOOKING_FIELD } from '../demo.constants';
import type { Guests } from '../demo.types';
import { guestColumns, guestsLabel } from '../demo.utils';

interface GuestsFieldProps {
  value: Guests;
  onConfirm: (guests: Guests) => void;
  sheetProps: Partial<BottomSheetProps>;
  options: TabOptions<'wheel'>;
}

interface GuestsSheetProps extends GuestsFieldProps {
  visible: boolean;
  onClose: () => void;
}

const GuestsSheet = ({ visible, onClose, value, onConfirm, sheetProps, options }: GuestsSheetProps) => {
  const [draft, setDraft] = useDraft(value, visible);
  return (
    <PickerSheet
      visible={visible}
      onClose={onClose}
      title={BOOKING_FIELD.guests}
      sheetProps={sheetProps}
      onConfirm={() => {
        onConfirm(draft);
        onClose();
      }}
    >
      <MultiWheelPicker
        variant={options.variant}
        visibleItems={options.visibleItems}
        columns={guestColumns(draft, setDraft, options.loop)}
      />
    </PickerSheet>
  );
};

/** Adults and children on two wheels, in a field built from the library's parts: PickerField, PickerSheet and useDraft. */
export const GuestsField = (props: GuestsFieldProps) => (
  <PickerField label={BOOKING_FIELD.guests} displayValue={guestsLabel(props.value)}>
    {(sheet) => <GuestsSheet {...sheet} {...props} />}
  </PickerField>
);
