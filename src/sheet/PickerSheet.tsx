import { ScrollView, View } from 'react-native';

import { usePickerTheme } from '../core';
import { BottomSheet } from './BottomSheet';
import { SheetButton } from './components/SheetButton';
import { Dropdown } from './Dropdown';
import { FieldSheetContext, useFieldSheet } from './hooks/useFieldSheet';
import {
  DEFAULT_CANCEL_LABEL,
  DEFAULT_CONFIRM_LABEL,
  FIELD_PRESENTATION,
  PICKER_DROPDOWN_MAX_HEIGHT,
  PICKER_DROPDOWN_MIN_WIDTH,
} from './sheet.constants';
import { styles } from './sheet.styles';
import type { PickerSheetProps } from './sheet.types';

/** BottomSheet with Cancel / Done header buttons; inside a field set to `dropdown`, a dropdown under it with the buttons below. */
export const PickerSheet = ({
  visible,
  onClose,
  onConfirm,
  confirmDisabled,
  title,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  showCancel = true,
  presentation: presentationProp,
  sheetProps,
  theme: themeOverride,
  children,
}: PickerSheetProps) => {
  const theme = usePickerTheme(themeOverride);
  const field = useFieldSheet();
  const presentation = presentationProp ?? field?.presentation;
  const cancel = showCancel ? <SheetButton label={cancelLabel} onPress={onClose} theme={theme} /> : undefined;
  const confirm = onConfirm ? (
    <SheetButton label={confirmLabel} onPress={onConfirm} primary disabled={confirmDisabled} theme={theme} />
  ) : undefined;
  // A sheet opened from inside this one isn't in the field.
  const content = <FieldSheetContext.Provider value={null}>{children}</FieldSheetContext.Provider>;

  if (presentation === FIELD_PRESENTATION.dropdown) {
    return (
      <Dropdown
        visible={visible}
        onClose={onClose}
        anchor={field?.anchor ?? null}
        minWidth={PICKER_DROPDOWN_MIN_WIDTH}
        maxHeight={PICKER_DROPDOWN_MAX_HEIGHT}
        theme={themeOverride}
      >
        <ScrollView style={styles.dropdownScroll} bounces={false} nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
        {cancel || confirm ? (
          <View style={[styles.dropdownFooter, { borderTopColor: theme.colors.border, paddingHorizontal: theme.spacing.lg }]}>
            {cancel}
            {confirm}
          </View>
        ) : null}
      </Dropdown>
    );
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      presentation={presentation}
      theme={themeOverride}
      headerLeft={cancel}
      headerRight={confirm}
      {...sheetProps}
    >
      {content}
    </BottomSheet>
  );
};
