import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { PLATFORM } from '../../device/device.constants';
import type { Platform } from '../../device/device.types';
import { styles } from '../demo.styles';

interface AppScreenProps {
  platform: Platform;
  title: string;
  subtitle: string;
  /** A primary button pinned to the bottom */
  action?: ReactNode;
  /** The fields scroll between the title and the button, for a form taller than the screen */
  scroll?: boolean;
  children: ReactNode;
}

/** An app screen in the mock device: a large title, a line under it, the fields, and an optional button at the bottom. */
export const AppScreen = ({ platform, title, subtitle, action, scroll = false, children }: AppScreenProps) => {
  const { colors } = usePickerTheme();
  return (
    <View style={[styles.root, platform === PLATFORM.web && styles.browserRoot, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollBody}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.body}>{children}</View>
      )}
      {action}
    </View>
  );
};
