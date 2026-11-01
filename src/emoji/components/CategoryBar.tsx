import { Text, View } from 'react-native';

import { Touchable } from '../../core/components/Touchable';
import { ACTIVE_TAB, CATEGORY_BAR_POSITION, EMOJI_DESIGN, INACTIVE_TAB_OPACITY } from '../emoji.constants';
import { styles } from '../emoji.styles';
import type { CategoryBarProps } from '../emoji.types';

export const CategoryBar = ({ tabs, active, position, labels, icons, onSelect, theme, slots }: CategoryBarProps) => {
  const { activeTab } = EMOJI_DESIGN[theme.design];
  const underlined = activeTab === ACTIVE_TAB.underline;
  const pill = activeTab === ACTIVE_TAB.pill;
  return (
    <View
      style={[
        styles.bar,
        position === CATEGORY_BAR_POSITION.top ? styles.barTop : styles.barBottom,
        !underlined && styles.markedBar,
        { borderColor: theme.colors.border },
        slots?.categoryBar,
      ]}
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
            style={[
              styles.tab,
              !underlined && styles.markedTab,
              { borderRadius: pill ? theme.radius.full : theme.radius.sm },
              !underlined && selected && { backgroundColor: pill ? theme.colors.primaryMuted : theme.colors.surface },
              slots?.categoryTab,
              selected && slots?.activeCategoryTab,
            ]}
          >
            {typeof icon === 'string' ? (
              <Text style={[styles.tabIcon, { opacity: selected ? 1 : INACTIVE_TAB_OPACITY }]}>{icon}</Text>
            ) : (
              icon
            )}
            {underlined && (
              <View
                style={[
                  styles.tabIndicator,
                  position === CATEGORY_BAR_POSITION.top ? styles.tabIndicatorTop : styles.tabIndicatorBottom,
                  { backgroundColor: selected ? theme.colors.primary : 'transparent' },
                  slots?.categoryIndicator,
                ]}
              />
            )}
          </Touchable>
        );
      })}
    </View>
  );
};
