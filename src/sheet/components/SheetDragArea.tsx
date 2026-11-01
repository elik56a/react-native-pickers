import { Animated, StyleSheet, View } from 'react-native';

import { styles } from '../sheet.styles';
import type { SheetDragAreaProps } from '../sheet.types';

/** An invisible scroll view behind the sheet's handle and header: dragging scrolls it, and its offset moves the sheet natively. */
export const SheetDragArea = ({ contentHeight, initialOffset, snapToOffsets, onScroll, onDragEnd, style }: SheetDragAreaProps) => (
  <Animated.ScrollView
    style={[StyleSheet.absoluteFill, style]}
    contentOffset={{ x: 0, y: initialOffset }}
    snapToOffsets={snapToOffsets}
    decelerationRate="fast"
    bounces={false}
    overScrollMode="never"
    scrollsToTop={false}
    showsVerticalScrollIndicator={false}
    scrollEventThrottle={16}
    onScroll={onScroll}
    onScrollEndDrag={onDragEnd}
    onMomentumScrollEnd={onDragEnd}
    importantForAccessibility="no-hide-descendants"
    accessibilityElementsHidden
  >
    <View style={[styles.dragContent, { height: contentHeight }]} />
  </Animated.ScrollView>
);
