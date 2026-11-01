import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { CHECK_MARK } from '../action.constants';
import { styles } from '../action.styles';
import type { ActionSheetRowProps } from '../action.types';

export const ActionSheetRow = ({
  action,
  onPress,
  grouped,
  cancel = false,
  separated,
  rowHeight,
  iconAtEnd = false,
  theme,
  slots,
}: ActionSheetRowProps) => {
  const c = theme.colors;
  const color = action.disabled ? c.textDisabled : action.destructive ? c.danger : grouped ? c.primary : c.text;
  return (
    <Touchable
      theme={theme}
      onPress={() => onPress(action)}
      disabled={action.disabled}
      accessibilityRole="button"
      accessibilityLabel={action.description ? `${action.label}, ${action.description}` : action.label}
      accessibilityState={{ disabled: action.disabled, selected: action.selected }}
      testID={action.testID}
      style={[
        styles.row,
        grouped && styles.groupedRow,
        {
          minHeight: rowHeight,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          gap: theme.spacing.md,
        },
        separated && [styles.separator, { borderColor: c.border }],
        slots?.[cancel ? 'cancel' : 'action'],
      ]}
    >
      {!iconAtEnd && action.icon}
      <View style={grouped ? styles.groupedText : styles.text}>
        <PickerText
          theme={theme}
          size={grouped ? 'lg' : 'md'}
          weight={cancel && grouped ? 'bold' : 'regular'}
          style={[{ color }, slots?.[cancel ? 'cancelLabel' : 'actionLabel']]}
          numberOfLines={1}
        >
          {action.label}
        </PickerText>
        {action.description ? (
          <PickerText theme={theme} size="sm" color="textSecondary" style={slots?.actionDescription} numberOfLines={2}>
            {action.description}
          </PickerText>
        ) : null}
      </View>
      {action.selected && (
        <PickerText
          theme={theme}
          weight="bold"
          color="primary"
          style={[grouped && [styles.groupedCheck, { end: theme.spacing.lg }], slots?.check]}
        >
          {CHECK_MARK}
        </PickerText>
      )}
      {iconAtEnd && action.icon}
    </Touchable>
  );
};
