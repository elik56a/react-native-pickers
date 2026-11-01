import { Fragment } from 'react';
import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { DESIGN } from '../../core/theme/theme.constants';
import { InlinePanel } from '../../sheet/components/InlinePanel';
import { TIME_RANGE_ACCESSIBILITY_LABEL, TIME_RANGE_ARROW } from '../time.constants';
import { styles } from '../time.styles';
import type { RangeEndsProps } from '../time.types';

type RangeEndItem = RangeEndsProps['items'][number];

/** Start and End as each platform shows them: Calendar's rows on iOS, large time boxes on Material, side-by-side cards on the web. */
export const RangeEnds = ({ items, active, onSelect, duration, theme, renderPicker, testID }: RangeEndsProps) => {
  const c = theme.colors;
  const radio = (item: RangeEndItem) => ({
    onPress: () => onSelect(item.end),
    accessibilityRole: 'radio' as const,
    accessibilityLabel: `${item.label} ${item.time}`,
    accessibilityState: { checked: item.end === active },
    testID: testID && `${testID}-${item.end}`,
  });

  if (theme.design === DESIGN.ios) {
    return (
      <View accessibilityRole="radiogroup" accessibilityLabel={TIME_RANGE_ACCESSIBILITY_LABEL} testID={testID}>
        {items.map((item, index) => (
          <Fragment key={item.end}>
            {index > 0 ? <View style={[styles.rangeSeparator, { backgroundColor: c.border }]} /> : null}
            <Touchable theme={theme} {...radio(item)} style={styles.rangeRow}>
              <Text style={[textStyle(theme, 'md'), { color: c.text }]}>{item.label}</Text>
              <View style={[styles.rangePill, { backgroundColor: c.surface, borderRadius: theme.radius.sm }]}>
                <Text style={[textStyle(theme, 'md'), { color: item.end === active ? c.primary : c.text }]}>{item.time}</Text>
              </View>
            </Touchable>
            <InlinePanel visible={item.end === active} theme={theme}>
              {renderPicker(item.end)}
            </InlinePanel>
          </Fragment>
        ))}
      </View>
    );
  }

  const web = theme.design === DESIGN.web;
  const box = (item: RangeEndItem) => {
    const on = item.end === active;
    const label = <Text style={[textStyle(theme, 'xs', 'medium'), { color: on ? c.primary : c.textSecondary }]}>{item.label}</Text>;
    return (
      <View style={{ gap: theme.spacing.xs }}>
        {web ? null : label}
        <Touchable
          theme={theme}
          {...radio(item)}
          style={[
            styles.rangeBox,
            web
              ? { borderWidth: 1, borderColor: on ? c.primary : c.border, borderRadius: theme.radius.md }
              : { backgroundColor: on ? c.primaryMuted : c.surface, borderRadius: theme.radius.sm },
          ]}
        >
          {web ? label : null}
          <Text style={[textStyle(theme, web ? 'md' : 'lg', 'medium'), { color: on && !web ? c.primary : c.text }]}>{item.time}</Text>
        </Touchable>
      </View>
    );
  };
  return (
    <View>
      <View accessibilityRole="radiogroup" accessibilityLabel={TIME_RANGE_ACCESSIBILITY_LABEL} style={styles.rangeBoxes} testID={testID}>
        {box(items[0])}
        <View style={styles.rangeArrow}>
          <Text style={[textStyle(theme, 'md'), { color: c.textSecondary }]}>{TIME_RANGE_ARROW}</Text>
          <Text style={[textStyle(theme, 'xs'), { color: c.textSecondary }]}>{duration}</Text>
        </View>
        {box(items[1])}
      </View>
      {renderPicker(active)}
    </View>
  );
};
