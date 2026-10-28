import { StyleSheet } from 'react-native';

import {
  CHIP_HEIGHT,
  OUTLINED_SEGMENT_HEIGHT,
  SCROLL_ARROW_SIZE,
  SEGMENT_GAP,
  SEGMENT_HEIGHT,
  SEGMENT_THUMB_SHADOW,
  TRACK_PADDING,
} from './list.constants';

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
  arrowFrame: { flexDirection: 'row', alignItems: 'center' },
  /** Grows and shrinks from its content width: a zero basis (`flex: 1`) collapses it when the frame sizes to its children. */
  arrowFrameList: { flexGrow: 1, flexShrink: 1 },
  arrowSlot: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center' },
  arrowSlotLeft: { left: 0 },
  arrowSlotRight: { right: 0 },
  arrow: {
    width: SCROLL_ARROW_SIZE,
    height: SCROLL_ARROW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    boxShadow: SEGMENT_THUMB_SHADOW,
  },
  arrowText: { lineHeight: 20 },
});
