import { View } from 'react-native';

import { NOW_MARKER } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { NowIndicatorProps } from '../schedule.types';

/** The line at the current time across today's column: with a dot where it starts in Material and on the web. */
export const NowIndicator = ({ offset, dayIndex, days, design, theme, slots }: NowIndicatorProps) => (
  <View pointerEvents="none" style={[styles.nowLayer, { top: offset, start: `${(dayIndex / days) * 100}%`, width: `${100 / days}%` }]}>
    <View style={[styles.nowLine, { backgroundColor: theme.colors.danger }, slots?.nowLine]} />
    {design.nowMarker === NOW_MARKER.dot && <View style={[styles.nowDot, { backgroundColor: theme.colors.danger }]} />}
  </View>
);
