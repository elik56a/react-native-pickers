import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { MARK_LABEL_BOX_WIDTH } from '../slider.constants';
import { styles } from '../slider.styles';
import type { MarkLabelsProps } from '../slider.types';

/** The marks' labels under the track, each centred on its mark; the ones in the filled part read stronger. */
export const MarkLabels = ({ labels, theme, slots }: MarkLabelsProps) => (
  <View pointerEvents="none" style={styles.markLabels}>
    {labels.map((mark) => (
      <View key={mark.key} style={[styles.markLabelBox, { start: mark.x - MARK_LABEL_BOX_WIDTH / 2 }]}>
        <PickerText theme={theme} size="sm" color={mark.active ? 'text' : 'textSecondary'} style={slots?.markLabel} numberOfLines={1}>
          {mark.label}
        </PickerText>
      </View>
    ))}
  </View>
);
