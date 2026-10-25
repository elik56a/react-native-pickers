import { Pressable, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { ARROW_DIRECTIONS, ARROW_LABELS } from '../calendar.constants';
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
    <Pressable
      onPress={enableQuickJump ? onTitlePress : undefined}
      style={({ pressed }) => [styles.titleButton, { borderRadius: theme.radius.sm, opacity: pressed ? 0.6 : 1 }]}
      accessibilityRole={enableQuickJump ? 'button' : 'header'}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={[textStyle(theme, 'md', 'bold'), slots?.headerTitle]}>{label}</Text>
      {enableQuickJump && (
        <Text style={[textStyle(theme, 'sm', 'bold'), styles.caret, { color: theme.colors.primary }]}>{view === 'days' ? '▾' : '▴'}</Text>
      )}
    </Pressable>
    <View style={styles.arrows}>
      {ARROW_DIRECTIONS.map((direction) => {
        const disabled = isArrowDisabled(direction);
        return (
          <Pressable
            key={direction}
            onPress={disabled ? undefined : () => onArrowPress(direction)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.arrow,
              { borderRadius: theme.radius.full, backgroundColor: pressed ? theme.colors.surface : 'transparent' },
              slots?.arrow,
            ]}
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
          </Pressable>
        );
      })}
    </View>
  </View>
);
