import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { HOUR_LABEL_HEIGHT, NOW_MARKER } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { HourGutterProps } from '../schedule.types';
import { formatHourLabel, formatNowLabel } from '../schedule.utils';

/** The hours down the side, each centred on its line, and on iOS the current time in a pill. */
export const HourGutter = ({ hours, startHour, hourHeight, hour12, locale, now, nowOffset, design, theme, slots }: HourGutterProps) => (
  <View style={styles.gutter} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
    {hours.map((hour, i) => {
      if (!design.labelEnds && (i === 0 || i === hours.length - 1)) return null;
      const top = (hour - startHour) * hourHeight - HOUR_LABEL_HEIGHT / 2;
      // The pill covers the label it overlaps, as on iOS.
      const hidden =
        nowOffset !== null &&
        design.nowMarker === NOW_MARKER.time &&
        Math.abs(top - (nowOffset - HOUR_LABEL_HEIGHT / 2)) < HOUR_LABEL_HEIGHT;
      return (
        <View key={hour} style={[styles.hourLabel, { top, opacity: hidden ? 0 : 1 }]}>
          <PickerText theme={theme} size="xs" color="textSecondary" numberOfLines={1} style={slots?.hourLabel}>
            {formatHourLabel(hour, locale, hour12)}
          </PickerText>
        </View>
      );
    })}
    {nowOffset !== null && design.nowMarker === NOW_MARKER.time && (
      <View style={[styles.nowPill, { top: nowOffset - HOUR_LABEL_HEIGHT / 2, backgroundColor: theme.colors.danger }]}>
        <PickerText theme={theme} size="xs" weight="bold" numberOfLines={1} style={{ color: theme.colors.onPrimary }}>
          {formatNowLabel(now, locale, hour12)}
        </PickerText>
      </View>
    )}
  </View>
);
