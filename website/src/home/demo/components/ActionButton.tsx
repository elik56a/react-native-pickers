import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { RESERVE_PHASE } from '../demo.constants';
import { styles } from '../demo.styles';
import { useReserve } from '../hooks/useReserve';

interface ActionButtonProps {
  label: string;
  /** Shown with a spinner while the button fills like a progress bar */
  busyLabel: string;
  /** Pops in once it's done, then the button goes back to `label` */
  doneLabel: string;
  disabled?: boolean;
  /** Runs on press; the request only starts when it returns true, such as a form with no errors */
  validate?: () => boolean;
}

/** A primary button that acts out a request when pressed: busy with a spinner and a filling bar, then done, then ready again. */
export const ActionButton = ({ label, busyLabel, doneLabel, disabled = false, validate }: ActionButtonProps) => {
  const { colors, radius } = usePickerTheme();
  const { phase, progress, pop, reserve } = useReserve();
  const busy = phase === RESERVE_PHASE.reserving;
  const text = [styles.reserveText, { color: colors.onPrimary }];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy }}
      disabled={disabled || phase !== RESERVE_PHASE.idle}
      onPress={() => {
        if (validate?.() ?? true) reserve();
      }}
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
          <Text style={text}>{busyLabel}</Text>
        </View>
      ) : phase === RESERVE_PHASE.reserved ? (
        <Animated.Text style={[text, { transform: [{ scale: pop }] }]}>{doneLabel}</Animated.Text>
      ) : (
        <Text style={text}>{label}</Text>
      )}
    </Pressable>
  );
};
