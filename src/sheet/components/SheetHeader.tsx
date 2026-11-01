import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { SHEET_DESIGN, TITLE_ALIGN } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { SheetHeaderProps } from '../sheet.types';

export const SheetHeader = ({ title, headerLeft, headerRight, theme, slots }: SheetHeaderProps) => {
  const start = SHEET_DESIGN[theme.design].titleAlign === TITLE_ALIGN.start;
  return (
    // Touches pass through all but the header's own controls, to the sheet's drag area behind it.
    <View style={[styles.header, { paddingHorizontal: theme.spacing.lg }, slots?.header]} pointerEvents="box-none">
      {start && !headerLeft ? null : (
        <View style={styles.headerSide} pointerEvents="box-none">
          {headerLeft}
        </View>
      )}
      <View style={[styles.headerCenter, start && styles.headerStart]} pointerEvents={typeof title === 'string' ? 'none' : 'box-none'}>
        {typeof title === 'string' ? (
          <PickerText
            theme={theme}
            size={start ? 'lg' : 'md'}
            weight="bold"
            style={slots?.title}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </PickerText>
        ) : (
          title
        )}
      </View>
      <View style={[styles.headerSide, styles.headerRight]} pointerEvents="box-none">
        {headerRight}
      </View>
    </View>
  );
};
