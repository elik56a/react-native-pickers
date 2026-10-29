import { View } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { RatingItem } from './components/RatingItem';
import { useRating } from './hooks/useRating';
import { DEFAULT_RATING_SIZE, RATING_COLOR } from './rating.constants';
import { styles } from './rating.styles';
import type { RatingProps } from './rating.types';

/** A row of stars to rate with: tap or drag across them, in whole or half steps, or show a score read-only. */
export const Rating = (props: RatingProps) => {
  const {
    size = DEFAULT_RATING_SIZE,
    color = RATING_COLOR,
    emptyColor,
    renderIcon,
    disabled,
    style,
    styles: slots,
    theme: themeProp,
    design,
    testID,
  } = props;
  const theme = usePickerTheme(useDesignOverride(themeProp, design));
  const rating = useRating(props, theme);

  return (
    <View
      style={[styles.row, { gap: rating.gap }, rating.interactive && styles.pointer, disabled && styles.disabled, slots?.container, style]}
      onLayout={rating.onLayout}
      {...rating.panHandlers}
      {...rating.hoverHandlers}
      {...rating.a11y}
      testID={testID}
    >
      {rating.items.map((item) => (
        <RatingItem
          key={item.key}
          item={item}
          size={size}
          color={color}
          emptyColor={emptyColor ?? theme.colors.border}
          renderIcon={renderIcon}
          slots={slots}
          testID={testID ? `${testID}-star-${item.index}` : undefined}
        />
      ))}
    </View>
  );
};
