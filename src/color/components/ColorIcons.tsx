import { View } from 'react-native';

import { styles } from '../color.styles';

/** Two overlapping squares, drawn with views so they need no icon font. */
export const CopyIcon = ({ color }: { color: string }) => (
  <View style={styles.copyIcon}>
    <View style={[styles.copyBack, { borderColor: color }]} />
    <View style={[styles.copyFront, { borderColor: color }]} />
  </View>
);

/** A pipette: bulb, glass and tip, tilted. */
export const EyedropperIcon = ({ color }: { color: string }) => (
  <View style={styles.dropperIcon}>
    <View style={[styles.dropperBulb, { backgroundColor: color }]} />
    <View style={[styles.dropperBody, { borderColor: color }]} />
    <View style={[styles.dropperTip, { backgroundColor: color }]} />
  </View>
);
