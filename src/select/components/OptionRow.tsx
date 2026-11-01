import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { DISABLED_OPTION_OPACITY, SELECT_DESIGN, SINGLE_INDICATOR } from '../select.constants';
import { styles } from '../select.styles';
import type { OptionRowProps } from '../select.types';
import { Check } from './Check';

export const OptionRow = <T,>({
  option,
  selected,
  disabled,
  multiple,
  showCheckmarks,
  renderOption,
  onToggle,
  theme,
  slots,
}: OptionRowProps<T>) => {
  const c = theme.colors;
  const look = SELECT_DESIGN[theme.design];
  const radio = !multiple && look.singleIndicator === SINGLE_INDICATOR.radio;
  return (
    <Touchable
      theme={theme}
      disabled={disabled}
      onPress={() => onToggle(option)}
      accessibilityRole={multiple ? 'checkbox' : radio ? 'radio' : 'button'}
      accessibilityState={{ selected, checked: multiple || radio ? selected : undefined, disabled }}
      accessibilityLabel={option.label}
      style={[
        styles.option,
        {
          minHeight: look.rowHeight,
          paddingHorizontal: theme.spacing.lg,
          marginHorizontal: look.insetRows ? theme.spacing.sm : 0,
          borderRadius: look.insetRows ? theme.radius.md : 0,
          backgroundColor: selected && look.tintSelected ? c.primaryMuted : 'transparent',
          opacity: disabled ? DISABLED_OPTION_OPACITY : 1,
        },
        slots?.option,
        selected && slots?.selectedOption,
      ]}
    >
      {renderOption ? (
        renderOption({ option, selected, disabled, theme })
      ) : (
        <>
          {option.icon ? <View style={[styles.icon, { marginEnd: theme.spacing.md }]}>{option.icon}</View> : null}
          <View style={styles.flex}>
            <PickerText
              theme={theme}
              weight={selected ? 'medium' : 'regular'}
              numberOfLines={1}
              style={[coreStyles.startAligned, slots?.optionLabel, selected && slots?.selectedOptionLabel]}
            >
              {option.label}
            </PickerText>
            {option.description ? (
              <PickerText
                theme={theme}
                size="sm"
                color="textSecondary"
                numberOfLines={2}
                style={[coreStyles.startAligned, styles.description, slots?.optionDescription]}
              >
                {option.description}
              </PickerText>
            ) : null}
          </View>
          {showCheckmarks && (multiple || radio || selected) ? (
            <Check selected={selected} multiple={multiple} radio={radio} theme={theme} style={slots?.check} />
          ) : null}
        </>
      )}
    </Touchable>
  );
};
