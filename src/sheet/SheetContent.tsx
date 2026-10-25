import { View } from 'react-native';

import { styles } from './sheet.styles';
import type { SheetContentProps } from './sheet.types';

export const SheetContent = ({ children, compact }: SheetContentProps) => (
  <View style={[styles.content, compact && styles.compactContent]}>{children}</View>
);
