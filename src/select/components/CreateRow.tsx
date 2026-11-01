import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { CREATE_ICON, SELECT_DESIGN } from '../select.constants';
import { styles } from '../select.styles';
import type { CreateRowProps } from '../select.types';

/** The last row while the search matches no option's label: offers the typed text as a new option. */
export const CreateRow = ({ text, label, onCreate, theme, slots }: CreateRowProps) => {
  const look = SELECT_DESIGN[theme.design];
  return (
    <Touchable
      theme={theme}
      onPress={() => onCreate(text)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.option,
        {
          minHeight: look.rowHeight,
          paddingHorizontal: theme.spacing.lg,
          marginHorizontal: look.insetRows ? theme.spacing.sm : 0,
          borderRadius: look.insetRows ? theme.radius.md : 0,
        },
        slots?.createOption,
      ]}
    >
      <PickerText theme={theme} size="lg" weight="medium" color="primary" style={{ marginEnd: theme.spacing.md }}>
        {CREATE_ICON}
      </PickerText>
      <PickerText
        theme={theme}
        weight="medium"
        color="primary"
        numberOfLines={1}
        style={[coreStyles.startAligned, styles.flex, slots?.createOptionLabel]}
      >
        {label}
      </PickerText>
    </Touchable>
  );
};
