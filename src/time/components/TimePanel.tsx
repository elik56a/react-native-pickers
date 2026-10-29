import { View } from 'react-native';

import { ARROW_FOCUS } from '../../core/utils/keyboard.utils';
import { DEFAULT_PANEL_ROWS } from '../time.constants';
import { styles } from '../time.styles';
import type { TimePanelProps } from '../time.types';
import { TimePanelColumn } from './TimePanelColumn';

/** The web's time picker: hours, minutes (and seconds) and AM/PM side by side, each a column of cells to click, the chosen one filled. */
export const TimePanel = ({ columns, visibleRows = DEFAULT_PANEL_ROWS, theme, style, testID }: TimePanelProps) => (
  <View
    style={[
      styles.panel,
      { borderColor: theme.colors.border, borderRadius: theme.radius.md, backgroundColor: theme.colors.background },
      style,
    ]}
    {...ARROW_FOCUS}
    testID={testID}
  >
    {columns.map((column) => (
      <TimePanelColumn key={column.key} column={column} visibleRows={visibleRows} theme={theme} />
    ))}
  </View>
);
