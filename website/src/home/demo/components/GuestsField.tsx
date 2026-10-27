import type { BottomSheetProps } from '@elik56a/react-native-pickers';
import { MultiWheelPicker, PickerField, PickerSheet, useDraft } from '@elik56a/react-native-pickers';
import type { TabOptions } from '../../playground/playground.types';
import { ADULTS, BOOKING_FIELD, CHILDREN } from '../demo.constants';
import type { Guests } from '../demo.types';
import { adultsLabel, childrenLabel, guestsLabel } from '../demo.utils';

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

const ADULT_ITEMS = ADULTS.map((n) => ({
  label: adultsLabel(n),
  value: n,
}));
const CHILD_ITEMS = CHILDREN.map((n) => ({
  label: childrenLabel(n),
  value: n,
}));

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
        columns={[
          {
            key: 'adults',
            items: ADULT_ITEMS,
            value: draft.adults,
            onChange: (adults: number) => setDraft({ ...draft, adults }),
            loop: options.loop,
            accessibilityLabel: 'Adults',
          },
          {
            key: 'children',
            items: CHILD_ITEMS,
            value: draft.children,
            onChange: (children: number) => setDraft({ ...draft, children }),
            loop: options.loop,
            accessibilityLabel: 'Children',
          },
        ]}
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
