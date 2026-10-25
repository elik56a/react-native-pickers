import { Platform, StyleSheet } from 'react-native';

export const coreStyles = StyleSheet.create({
  /**
   * React Native Web renders Text with dir="auto", so each label aligns by its own script (Hebrew right, English left).
   * ponytail: pinned left because RN Web has no RTL layout flag; RTL web apps override it through the slot styles.
   */
  startAligned: Platform.select({ web: { textAlign: 'left' }, default: {} }),
});
