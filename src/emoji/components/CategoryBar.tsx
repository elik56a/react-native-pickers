import { Text, View } from 'react-native';

import { Touchable } from '../../core/components/Touchable';
import { INACTIVE_TAB_OPACITY } from '../emoji.constants';
import { styles } from '../emoji.styles';
import type { CategoryBarProps } from '../emoji.types';

export const CategoryBar = ({ tabs, active, position, labels, icons, onSelect, theme, slots }: CategoryBarProps) => (
  <View
    style={[styles.bar, position === 'top' ? styles.barTop : styles.barBottom, { borderColor: theme.colors.border }, slots?.categoryBar]}
  >
    {tabs.map((key) => {
      const selected = active === key;
      const icon = icons[key];
      return (
        <Touchable
          key={key}
          theme={theme}
          onPress={() => onSelect(key)}
          accessibilityRole="tab"
          accessibilityLabel={labels[key]}
          accessibilityState={{ selected }}
          style={[styles.tab, { borderRadius: theme.radius.sm }, slots?.categoryTab, selected && slots?.activeCategoryTab]}
        >
          {typeof icon === 'string' ? <Text style={[styles.tabIcon, { opacity: selected ? 1 : INACTIVE_TAB_OPACITY }]}>{icon}</Text> : icon}
          <View
            style={[
              styles.tabIndicator,
              position === 'top' ? styles.tabIndicatorTop : styles.tabIndicatorBottom,
              { backgroundColor: selected ? theme.colors.primary : 'transparent' },
              slots?.categoryIndicator,
            ]}
          />
        </Touchable>
      );
    })}
  </View>
);
