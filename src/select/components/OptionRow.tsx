import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { DISABLED_OPTION_OPACITY } from '../select.constants';
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
  return (
    <Touchable
      theme={theme}
      disabled={disabled}
      onPress={() => onToggle(option)}
      accessibilityRole={multiple ? 'checkbox' : 'button'}
      accessibilityState={{ selected, checked: multiple ? selected : undefined, disabled }}
      accessibilityLabel={option.label}
      style={[
        styles.option,
        {
          paddingHorizontal: theme.spacing.lg,
          marginHorizontal: theme.spacing.sm,
          borderRadius: theme.radius.md,
          backgroundColor: selected ? c.primaryMuted : 'transparent',
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
            <Text
              numberOfLines={1}
              style={[
                textStyle(theme, 'md', selected ? 'medium' : 'regular'),
                coreStyles.startAligned,
                slots?.optionLabel,
                selected && slots?.selectedOptionLabel,
              ]}
            >
              {option.label}
            </Text>
            {option.description ? (
              <Text
                numberOfLines={2}
                style={[
                  textStyle(theme, 'sm'),
                  coreStyles.startAligned,
                  styles.description,
                  { color: c.textSecondary },
                  slots?.optionDescription,
                ]}
              >
                {option.description}
              </Text>
            ) : null}
          </View>
          {showCheckmarks && (multiple || selected) ? (
            <Check selected={selected} multiple={multiple} theme={theme} style={slots?.check} />
          ) : null}
        </>
      )}
    </Touchable>
  );
};
