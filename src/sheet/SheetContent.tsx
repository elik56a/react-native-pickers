import { StyleSheet, View } from 'react-native';

import type { SheetContentProps } from './sheet.types';

export const SheetContent = ({ children, compact }: SheetContentProps) => (
  <View style={[styles.content, compact && styles.compact]}>{children}</View>
);

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 8 },
  compact: { paddingHorizontal: 8 },
});
