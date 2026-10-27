import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { fitsBeside } from '../datetime.utils';

/**
 * Puts the time beside the calendar only when both fit, else under it. The time's width is measured while it's beside the calendar,
 * so a wider window can bring it back; a new `timeKey` (another display, format…) forgets it, to try beside again and re-measure.
 */
export const useBesideFit = (wanted: boolean, timeKey: string) => {
  const [width, setWidth] = useState(0);
  const [timeWidth, setTimeWidth] = useState(0);
  const [measuredKey, setMeasuredKey] = useState(timeKey);
  if (timeKey !== measuredKey) {
    setMeasuredKey(timeKey);
    setTimeWidth(0);
  }
  const beside = wanted && fitsBeside(width, timeWidth);
  return {
    beside,
    onLayout: (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width),
    onTimeLayout: (e: LayoutChangeEvent) => {
      if (beside) setTimeWidth(e.nativeEvent.layout.width);
    },
  };
};
