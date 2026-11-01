import { Text } from 'react-native';

import type { PickerTextProps } from '../core.types';
import { textStyle } from '../theme/theme.utils';

/** Text in the theme's type scale and one of its colors; `style` goes on top. */
export const PickerText = ({ theme, size = 'md', weight = 'regular', color = 'text', style, ...rest }: PickerTextProps) => (
  <Text style={[textStyle(theme, size, weight), { color: theme.colors[color] }, style]} {...rest} />
);
