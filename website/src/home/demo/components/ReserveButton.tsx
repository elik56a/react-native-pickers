import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { RESERVE_PHASE } from '../demo.constants';
import { styles } from '../demo.styles';
import { useReserve } from '../hooks/useReserve';

export const ReserveButton = ({ total, disabled }: { total: number; disabled: boolean }) => {
  const { colors, radius } = usePickerTheme();
  const { phase, progress, pop, reserve } = useReserve();
  const busy = phase === RESERVE_PHASE.reserving;
  const label = [styles.reserveText, { color: colors.onPrimary }];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy }}
      disabled={disabled || phase !== RESERVE_PHASE.idle}
      onPress={reserve}
      style={[styles.reserve, { backgroundColor: colors.primary, borderRadius: radius.lg }, disabled && styles.reserveDisabled]}
    >
      {busy && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.reserveProgress,
            { backgroundColor: colors.onPrimary, transform: [{ scaleX: progress }] },
          ]}
        />
      )}
      {busy ? (
        <View style={styles.reserveRow}>
          <ActivityIndicator size="small" color={colors.onPrimary} />
          <Text style={label}>Reserving…</Text>
        </View>
      ) : phase === RESERVE_PHASE.reserved ? (
        <Animated.Text style={[label, { transform: [{ scale: pop }] }]}>✓ Reserved</Animated.Text>
      ) : (
        <Text style={label}>Reserve · ${total}</Text>
      )}
    </Pressable>
  );
};
