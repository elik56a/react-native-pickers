import { Text } from 'react-native';

import { styles } from '../country.styles';
import type { CountryFlagProps } from '../country.types';
import { getCountryFlag } from '../country.utils';

/** The flag emoji, hidden from screen readers: the row already reads the country's name. */
export const CountryFlag = ({ code }: CountryFlagProps) => (
  <Text style={styles.flag} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {getCountryFlag(code)}
  </Text>
);
