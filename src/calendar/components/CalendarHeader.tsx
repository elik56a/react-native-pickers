import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { ARROW_DIRECTIONS, ARROW_LABELS, CALENDAR_DESIGN, CALENDAR_VIEW } from '../calendar.constants';
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
      <PickerText theme={theme} weight="bold" style={slots?.headerTitle}>
        {label}
      </PickerText>
      {enableQuickJump && (
        <PickerText theme={theme} size="sm" weight="bold" color="primary" style={styles.caret}>
          {view === CALENDAR_VIEW.days ? '▾' : '▴'}
        </PickerText>
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
              <PickerText
                theme={theme}
                size="lg"
                weight="bold"
                color={disabled ? 'textDisabled' : CALENDAR_DESIGN[theme.design].arrowColor}
                style={[styles.arrowText, slots?.arrowText]}
              >
                {getArrowGlyph(direction, rtl)}
              </PickerText>
            )}
          </Touchable>
        );
      })}
    </View>
  </View>
);
