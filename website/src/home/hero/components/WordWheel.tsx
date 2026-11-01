import { WheelPicker } from '@elik56a/react-native-pickers';
import { HERO_LETTER_SPACING, HERO_WHEEL_COLORS, HERO_WHEEL_ITEMS, HERO_WHEEL_SIZE } from '../hero.constants';
import { styles } from '../hero.styles';
import type { HeroWord, WordWheelProps } from '../hero.types';

/** The headline's word: a real WheelPicker, so the first thing a visitor spins is the library itself. */
export const WordWheel = ({ value, onChange, wide, centered, colorMode }: WordWheelProps) => {
  const { fontSize, itemHeight, visibleItems } = wide ? HERO_WHEEL_SIZE.wide : HERO_WHEEL_SIZE.narrow;
  const colors = HERO_WHEEL_COLORS[colorMode];
  const text = { fontSize, lineHeight: itemHeight, letterSpacing: fontSize * HERO_LETTER_SPACING, color: colors.faint };
  return (
    <WheelPicker<HeroWord>
      items={HERO_WHEEL_ITEMS}
      value={value}
      onChange={onChange}
      itemHeight={itemHeight}
      visibleItems={visibleItems}
      loop
      keyboardInput={false}
      showIndicator={false}
      fadeTo={0.1}
      rotation={28}
      textAlign={centered ? 'center' : 'left'}
      accessibilityLabel="Show a picker"
      style={styles.wheel}
      styles={{
        container: styles.wheelContainer,
        itemText: [styles.wheelText, text],
        selectedItemText: [styles.wheelText, text, { color: colors.accent }],
      }}
    />
  );
};
