import { Text, View } from 'react-native';

import { textStyle } from '../../core';
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
      {iconAtEnd ? null : action.icon}
      <View style={grouped ? styles.groupedText : styles.text}>
        <Text
          style={[
            textStyle(theme, grouped ? 'lg' : 'md', cancel && grouped ? 'bold' : 'regular'),
            { color },
            slots?.[cancel ? 'cancelLabel' : 'actionLabel'],
          ]}
          numberOfLines={1}
        >
          {action.label}
        </Text>
        {action.description ? (
          <Text style={[textStyle(theme, 'sm'), { color: c.textSecondary }, slots?.actionDescription]} numberOfLines={2}>
            {action.description}
          </Text>
        ) : null}
      </View>
      {action.selected ? (
        <Text
          style={[
            textStyle(theme, 'md', 'bold'),
            { color: c.primary },
            grouped && [styles.groupedCheck, { end: theme.spacing.lg }],
            slots?.check,
          ]}
        >
          {CHECK_MARK}
        </Text>
      ) : null}
      {iconAtEnd ? action.icon : null}
    </Touchable>
  );
};
