import { StyleSheet } from 'react-native';

import { CHIP_HEIGHT, OUTLINED_SEGMENT_HEIGHT, SEGMENT_GAP, SEGMENT_HEIGHT, SEGMENT_THUMB_SHADOW, TRACK_PADDING } from './list.constants';

export const styles = StyleSheet.create({
  /** ScrollView grows by default, which would stretch a row inside a column. */
  list: { flexGrow: 0 },
  content: { flexDirection: 'row', alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  chip: { height: CHIP_HEIGHT },
  track: { overflow: 'hidden' },
  trackContent: { flexGrow: 1, padding: TRACK_PADDING, gap: SEGMENT_GAP },
  segmentSlot: { flexGrow: 1 },
  segment: { height: SEGMENT_HEIGHT },
  outlinedTrack: { borderWidth: 1 },
  outlinedContent: { flexGrow: 1 },
  outlinedSegment: { borderRadius: 0 },
  outlinedSegmentHeight: { height: OUTLINED_SEGMENT_HEIGHT },
  thumb: { position: 'absolute', top: TRACK_PADDING, bottom: TRACK_PADDING, boxShadow: SEGMENT_THUMB_SHADOW },
});
