import { Text, View } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { styles } from '../showcase.styles';
import type { SliderSettingProps } from '../showcase.types';

/** A settings row: its name and current value over the slider that sets it. */
export const SliderSetting = ({ label, value, children }: SliderSettingProps) => {
  const { colors } = usePickerTheme();
  return (
    <View style={styles.setting}>
      <View style={styles.settingHeader}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>
      </View>
      {children}
    </View>
  );
};
