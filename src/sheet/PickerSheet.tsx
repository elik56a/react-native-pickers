import { ScrollView, View } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { BottomSheet } from './BottomSheet';
import { SheetButton } from './components/SheetButton';
import { Dropdown } from './Dropdown';
import { useDropdownFit } from './hooks/useDropdownFit';
import { FieldSheetContext, useFieldSheet } from './hooks/useFieldSheet';
import { DEFAULT_CANCEL_LABEL, FIELD_PRESENTATION, PICKER_DROPDOWN_MIN_WIDTH, SHEET_ACTIONS, SHEET_DESIGN } from './sheet.constants';
import { styles } from './sheet.styles';
import type { PickerSheetProps } from './sheet.types';

/** BottomSheet with Cancel / Done buttons where the design puts them; inside a field set to `dropdown`, a dropdown under it with the buttons below. */
export const PickerSheet = ({
  visible,
  onClose,
  onConfirm,
  confirmDisabled,
  title,
  confirmLabel: confirmLabelProp,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  showCancel = true,
  presentation: presentationProp,
  sheetProps,
  theme: themeProp,
  design,
  children,
}: PickerSheetProps) => {
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const sheetDesign = SHEET_DESIGN[theme.design];
  const confirmLabel = confirmLabelProp ?? sheetDesign.confirmLabel;
  const field = useFieldSheet();
  const presentation = presentationProp ?? field?.presentation;
  const fit = useDropdownFit();
  const cancel = showCancel ? <SheetButton label={cancelLabel} onPress={onClose} theme={theme} /> : undefined;
  const confirm = onConfirm ? (
    <SheetButton label={confirmLabel} onPress={onConfirm} primary disabled={confirmDisabled} theme={theme} />
  ) : undefined;
  const inHeader = sheetDesign.actions === SHEET_ACTIONS.header;
  const actions = (
    <View style={styles.actions}>
      {cancel}
      {confirm}
    </View>
  );
  // A sheet opened from inside this one isn't in the field.
  const content = <FieldSheetContext.Provider value={null}>{children}</FieldSheetContext.Provider>;

  if (presentation === FIELD_PRESENTATION.dropdown) {
    return (
      <Dropdown
        visible={visible}
        onClose={onClose}
        anchor={field?.anchor ?? null}
        minWidth={PICKER_DROPDOWN_MIN_WIDTH}
        maxHeight={fit.height}
        ready={fit.measured}
        theme={themeOverride}
      >
        <ScrollView
          style={styles.dropdownScroll}
          bounces={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={fit.onContentSizeChange}
        >
          {content}
        </ScrollView>
        {cancel || confirm ? (
          <View
            style={[styles.actions, styles.dropdownFooter, { borderTopColor: theme.colors.border, paddingHorizontal: theme.spacing.lg }]}
            onLayout={fit.onFooterLayout}
          >
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
      headerLeft={inHeader ? cancel : undefined}
      headerRight={inHeader ? confirm : undefined}
      footer={inHeader || !(cancel || confirm) ? undefined : actions}
      {...sheetProps}
    >
      {content}
    </BottomSheet>
  );
};
