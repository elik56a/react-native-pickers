import { useState } from 'react';
import { Text, View } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import type { PlaygroundConfig } from '../../../website/src/catalog/catalog.types';
import { usePlayground } from '../../../website/src/catalog/hooks/usePlayground';
import { styles } from '../example.styles';
import { Button } from './Button';
import { ControlRow } from './ControlRow';

/** A docs playground: the live component, with its props under it on phones and beside it on wide screens. */
export const PlaygroundCard = ({ config, wide }: { config: PlaygroundConfig; wide: boolean }) => {
  const { colors } = usePickerTheme();
  const { selection, choose, live } = usePlayground(config);
  const [open, setOpen] = useState(false);
  const { name, component: Component, controls, opener, children } = config;
  const sheet = opener ? { visible: open, onClose: () => setOpen(false) } : {};
  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{name}</Text>
      <View style={[styles.cardBody, wide && styles.cardWide]}>
        <View style={wide && styles.previewWide}>
          <View style={[styles.preview, styles.previewStage, config.wide && styles.previewStageWide]}>
            {opener ? <Button title={opener} onPress={() => setOpen(true)} /> : null}
            <Component {...live} {...sheet}>
              {children}
            </Component>
          </View>
        </View>
        <View style={[styles.props, wide && styles.propsWide, { borderColor: colors.border }]}>
          {controls.map((control) => (
            <ControlRow key={control.prop} control={control} selected={selection[control.prop]} onChoose={choose} />
          ))}
        </View>
      </View>
    </View>
  );
};
