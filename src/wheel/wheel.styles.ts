import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  centerOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'center' },
  row: { justifyContent: 'center' },
  typingRing: { borderWidth: 2 },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  columns: { flexDirection: 'row', flex: 1 },
  separator: { justifyContent: 'center', paddingHorizontal: 2 },
});
