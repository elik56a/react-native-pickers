import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { FieldTrigger } from '../../sheet/components/FieldTrigger';
import { styles } from '../select.styles';
import type { SelectTriggerProps } from '../select.types';
import { getSelectedLabel } from '../select.utils';

/** The shared field trigger, showing the selected label or removable chips. */
export const SelectTrigger = <T,>({ selected, multiple, chips, onRemove, disabled, theme, slots, ...trigger }: SelectTriggerProps<T>) => (
  <FieldTrigger
    {...trigger}
    displayValue={getSelectedLabel(selected)}
    icon={multiple ? undefined : selected[0]?.icon}
    disabled={disabled}
    theme={theme}
    slots={slots}
  >
    {multiple && chips && selected.length > 0 ? (
      <View style={styles.chips} pointerEvents="box-none">
        {selected.map((option) => (
          <Touchable
            key={option.label}
            theme={theme}
            onPress={() => onRemove(option)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${option.label}`}
            style={[styles.chip, { backgroundColor: theme.colors.primaryMuted, borderRadius: theme.radius.full }, slots?.chip]}
          >
            <PickerText theme={theme} size="sm" weight="medium" color="primary" style={slots?.chipText}>
              {option.label} ×
            </PickerText>
          </Touchable>
        ))}
      </View>
    ) : null}
  </FieldTrigger>
);
