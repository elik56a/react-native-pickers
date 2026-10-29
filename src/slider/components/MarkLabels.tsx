import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { MARK_LABEL_BOX_WIDTH } from '../slider.constants';
import { styles } from '../slider.styles';
import type { MarkLabelsProps } from '../slider.types';

/** The marks' labels under the track, each centred on its mark; the ones in the filled part read stronger. */
export const MarkLabels = ({ labels, theme, slots }: MarkLabelsProps) => (
  <View pointerEvents="none" style={styles.markLabels}>
    {labels.map((mark) => (
      <View key={mark.key} style={[styles.markLabelBox, { start: mark.x - MARK_LABEL_BOX_WIDTH / 2 }]}>
        <Text
          style={[textStyle(theme, 'sm'), { color: mark.active ? theme.colors.text : theme.colors.textSecondary }, slots?.markLabel]}
          numberOfLines={1}
        >
          {mark.label}
        </Text>
      </View>
    ))}
  </View>
);
