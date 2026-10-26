import { Animated, Pressable, Text, View } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { DEMO_TABS, TAB_LABELS } from '../../playground/playground.constants';
import type { DemoTab } from '../../playground/playground.types';
import { styles } from '../demo.styles';
import { useSlidingPill } from '../hooks/useSlidingPill';

export const DemoTabBar = ({ tab, onSelect }: { tab: DemoTab; onSelect: (tab: DemoTab) => void }) => {
  const { colors } = usePickerTheme();
  const pill = useSlidingPill(Math.max(0, DEMO_TABS.indexOf(tab)), DEMO_TABS.length);
  return (
    <View accessibilityRole="tablist" style={[styles.segmented, { backgroundColor: colors.surface }]} onLayout={pill.onLayout}>
      <Animated.View style={[styles.pill, { width: pill.width, backgroundColor: colors.text, transform: [{ translateX: pill.offset }] }]} />
      {DEMO_TABS.map((t) => {
        const on = t === tab;
        return (
          <Pressable
            key={t}
            onPress={() => onSelect(t)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={styles.segment}
          >
            <Text style={[styles.segmentLabel, { color: on ? colors.background : colors.textSecondary }]}>{TAB_LABELS[t]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
