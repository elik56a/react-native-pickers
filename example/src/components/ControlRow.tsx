import { Switch, Text, View } from 'react-native';

import { HorizontalList, SelectPicker, usePickerTheme } from '@elik56a/react-native-pickers';
import type { PlaygroundControl, PlaygroundOption } from '../../../website/src/catalog/catalog.types';
import { isSwitch, needsSelect, optionLabel, sameOption } from '../../../website/src/catalog/catalog.utils';
import { styles } from '../example.styles';

interface ControlRowProps {
  control: PlaygroundControl;
  selected: PlaygroundOption;
  onChoose: (prop: string, option: PlaygroundOption) => void;
}

/** One prop: a switch for true or false, segments for a few short options, a dropdown for the rest, as in the docs. */
export const ControlRow = ({ control: { prop, options }, selected, onChoose }: ControlRowProps) => {
  const { colors } = usePickerTheme();
  const name = <Text style={[styles.prop, { color: colors.text }]}>{prop}</Text>;

  if (isSwitch(options)) {
    return (
      <View style={styles.switchRow}>
        {name}
        <Switch accessibilityLabel={prop} value={selected === true} onValueChange={(on) => onChoose(prop, on)} />
      </View>
    );
  }

  const items = options.map((option, i) => ({
    label: optionLabel(option),
    value: i,
  }));
  const index = options.findIndex((option) => sameOption(selected, option));
  const choose = (i: number) => onChoose(prop, options[i]);
  return (
    <View style={styles.control}>
      {name}
      {needsSelect(items.map((item) => item.label)) ? (
        <SelectPicker options={items} value={index} onChange={choose} searchable={false} placeholder={prop} />
      ) : (
        <HorizontalList items={items} value={index} onChange={choose} />
      )}
    </View>
  );
};
