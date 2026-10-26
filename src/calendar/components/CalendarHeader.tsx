import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { ARROW_DIRECTIONS, ARROW_LABELS, CALENDAR_VIEW } from '../calendar.constants';
import { styles } from '../calendar.styles';
import type { CalendarHeaderProps } from '../calendar.types';
import { getArrowGlyph } from '../calendar.utils';

export const CalendarHeader = ({
  label,
  accessibilityLabel,
  view,
  enableQuickJump,
  isArrowDisabled,
  onTitlePress,
  onArrowPress,
  renderArrow,
  rtl,
  theme,
  slots,
}: CalendarHeaderProps) => (
  <View style={[styles.header, { paddingHorizontal: theme.spacing.sm, marginBottom: theme.spacing.sm }, slots?.header]}>
    <Touchable
      theme={theme}
      disabled={!enableQuickJump}
      onPress={onTitlePress}
      style={[styles.titleButton, { borderRadius: theme.radius.sm }]}
      accessibilityRole={enableQuickJump ? 'button' : 'header'}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={[textStyle(theme, 'md', 'bold'), slots?.headerTitle]}>{label}</Text>
      {enableQuickJump && (
        <Text style={[textStyle(theme, 'sm', 'bold'), styles.caret, { color: theme.colors.primary }]}>
          {view === CALENDAR_VIEW.days ? '▾' : '▴'}
        </Text>
      )}
    </Touchable>
    <View style={styles.arrows}>
      {ARROW_DIRECTIONS.map((direction) => {
        const disabled = isArrowDisabled(direction);
        return (
          <Touchable
            key={direction}
            theme={theme}
            disabled={disabled}
            onPress={() => onArrowPress(direction)}
            hitSlop={8}
            style={[styles.arrow, { borderRadius: theme.radius.full }, slots?.arrow]}
            accessibilityRole="button"
            accessibilityLabel={ARROW_LABELS[direction]}
            accessibilityState={{ disabled }}
          >
            {renderArrow ? (
              renderArrow(direction, disabled)
            ) : (
              <Text
                style={[
                  textStyle(theme, 'lg', 'bold'),
                  styles.arrowText,
                  { color: disabled ? theme.colors.textDisabled : theme.colors.primary },
                  slots?.arrowText,
                ]}
              >
                {getArrowGlyph(direction, rtl)}
              </Text>
            )}
          </Touchable>
        );
      })}
    </View>
  </View>
);
