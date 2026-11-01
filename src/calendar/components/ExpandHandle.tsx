import { View } from 'react-native';

import { Touchable } from '../../core/components/Touchable';
import { DESIGN } from '../../core/theme/theme.constants';
import { Chevron } from '../../sheet/components/Chevron';
import { EXPAND_LABEL } from '../calendar.constants';
import { styles } from '../calendar.styles';
import type { ExpandHandleProps } from '../calendar.types';

/** Under the days: a grabber on iOS, as a sheet has, and a chevron that flips in Material and on the web. */
export const ExpandHandle = ({ expanded, onPress, theme, slots }: ExpandHandleProps) => (
  <Touchable
    theme={theme}
    ripple={false}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={expanded ? EXPAND_LABEL.collapse : EXPAND_LABEL.expand}
    accessibilityState={{ expanded }}
    style={[styles.expandHandle, slots?.expandHandle]}
  >
    {theme.design === DESIGN.ios ? (
      <View style={[styles.grabber, { backgroundColor: theme.colors.handle }]} />
    ) : (
      <Chevron open={expanded} theme={theme} />
    )}
  </Touchable>
);
