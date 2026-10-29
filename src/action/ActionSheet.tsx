import { ScrollView, View } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { BottomSheet } from '../sheet/BottomSheet';
import { DEFAULT_CANCEL_LABEL } from '../sheet/sheet.constants';
import { ACTION_SHEET_DESIGN } from './action.constants';
import { styles } from './action.styles';
import type { ActionSheetProps } from './action.types';
import { ActionSheetHeader } from './components/ActionSheetHeader';
import { ActionSheetRow } from './components/ActionSheetRow';
import { useActionPress } from './hooks/useActionPress';

/** A list of actions in a bottom sheet: iOS cards with a separate Cancel, or Material and web rows with icons. `useActionSheet` shows one from a call. */
export const ActionSheet = ({
  visible,
  onClose,
  actions,
  title,
  message,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  showCancel,
  presentation,
  sheetProps,
  styles: slots,
  theme: themeProp,
  design,
  testID,
}: ActionSheetProps) => {
  const theme = usePickerTheme(useDesignOverride(themeProp, design));
  const look = ACTION_SHEET_DESIGN[theme.design];
  const { grouped } = look;
  const { press, onClosed } = useActionPress(onClose, sheetProps?.onClosed);
  const hasHeader = !!(title || message);
  const group = grouped && [styles.group, { backgroundColor: theme.colors.sheet, borderRadius: theme.radius.lg }, slots?.group];

  return (
    <BottomSheet
      expandable={false}
      showHandle={!grouped}
      presentation={presentation}
      {...sheetProps}
      styles={grouped ? { ...sheetProps?.styles, sheet: [styles.groupedSheet, sheetProps?.styles?.sheet] } : sheetProps?.styles}
      visible={visible}
      onClose={onClose}
      onClosed={onClosed}
      theme={themeProp}
      design={design}
      testID={testID}
    >
      <View style={group || styles.group}>
        <ActionSheetHeader title={title} message={message} grouped={grouped} theme={theme} slots={slots} />
        <ScrollView style={styles.list} bounces={false}>
          {actions.map((action, i) => (
            <ActionSheetRow
              key={action.label}
              action={action}
              onPress={press}
              grouped={grouped}
              separated={grouped && (i > 0 || hasHeader)}
              rowHeight={look.rowHeight}
              theme={theme}
              slots={slots}
            />
          ))}
        </ScrollView>
      </View>
      {(showCancel ?? look.showCancel) && (
        <View style={[group, grouped && styles.cancelGroup]}>
          <ActionSheetRow
            action={{ label: cancelLabel, testID: testID ? `${testID}-cancel` : undefined }}
            onPress={() => onClose()}
            grouped={grouped}
            cancel
            separated={!grouped}
            rowHeight={look.rowHeight}
            theme={theme}
            slots={slots}
          />
        </View>
      )}
    </BottomSheet>
  );
};
