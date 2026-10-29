import { Text } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { Chevron } from '../../sheet/components/Chevron';
import { PHONE_COUNTRY_BUTTON_LABEL } from '../country.constants';
import { styles } from '../country.styles';
import type { CountryButtonProps } from '../country.types';
import { getCallingCode } from '../country.utils';
import { CountryFlag } from './CountryFlag';

/** The flag and calling code at the start of a phone field; it opens the country list. */
export const CountryButton = ({ country, open, picking, disabled, theme, slots, testID }: CountryButtonProps) => {
  const callingCode = `+${getCallingCode(country.code)}`;
  return (
    <Touchable
      theme={theme}
      ripple={false}
      onPress={open}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${PHONE_COUNTRY_BUTTON_LABEL}: ${country.name} ${callingCode}`}
      accessibilityState={{ disabled, expanded: picking }}
      style={[
        styles.countryButton,
        { borderColor: theme.colors.border, paddingEnd: theme.spacing.sm, marginEnd: theme.spacing.sm },
        slots?.countryButton,
      ]}
      testID={testID}
    >
      <CountryFlag code={country.code} />
      <Text style={[textStyle(theme, 'md'), { color: theme.colors.text }, slots?.dialCode]}>{callingCode}</Text>
      <Chevron open={picking} theme={theme} style={slots?.chevron} />
    </Touchable>
  );
};
