import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { CountryFlag } from '../../country/components/CountryFlag';
import { Chevron } from '../../sheet/components/Chevron';
import { CURRENCY_BUTTON_LABEL } from '../currency.constants';
import { styles } from '../currency.styles';
import type { CurrencyButtonProps } from '../currency.types';

/** The currency's flag and code, at the start of an amount field or as a pill under a large amount; it opens the currency list. */
export const CurrencyButton = ({ currency, open, picking, disabled, pill, theme, slots, testID }: CurrencyButtonProps) => {
  const look = pill
    ? [
        styles.pill,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.full,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs,
          marginTop: theme.spacing.md,
        },
      ]
    : [styles.currencyButton, { borderColor: theme.colors.border, paddingEnd: theme.spacing.sm, marginEnd: theme.spacing.sm }];

  return (
    <Touchable
      theme={theme}
      ripple={false}
      onPress={open}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${CURRENCY_BUTTON_LABEL}: ${currency.name}`}
      accessibilityState={{ disabled, expanded: picking }}
      style={[look, slots?.currencyButton]}
      testID={testID}
    >
      {currency.country ? <CountryFlag code={currency.country} /> : null}
      <PickerText theme={theme} weight="medium" style={slots?.currencyCode}>
        {currency.code}
      </PickerText>
      <Chevron open={picking} theme={theme} style={slots?.chevron} />
    </Touchable>
  );
};
