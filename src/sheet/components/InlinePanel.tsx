import { Animated, View } from 'react-native';

import { OwnScroll } from '../../core/components/OwnScroll';
import { useInlineExpand } from '../hooks/useInlineExpand';
import { styles } from '../sheet.styles';
import type { InlinePanelProps } from '../sheet.types';

/** The picker expanded under its field, pushing the content below down. The content lays out at full height and is clipped while the panel grows. */
export const InlinePanel = ({ visible, children, theme }: InlinePanelProps) => {
  const expand = useInlineExpand(visible, theme.animation.duration);
  if (!expand.mounted) return null;

  return (
    <Animated.View style={[styles.inline, expand.style]} pointerEvents={visible ? 'auto' : 'none'}>
      <View style={[styles.inlineContent, { paddingTop: theme.spacing.sm }]} onLayout={expand.onLayout}>
        <OwnScroll>{children}</OwnScroll>
      </View>
    </Animated.View>
  );
};
