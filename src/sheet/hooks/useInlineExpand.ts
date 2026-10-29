import { useCallback, useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { usePresence } from '../../core/hooks/usePresence';
import type { InlineExpand } from '../sheet.types';

/** Grows down to the content's height on open and folds back up before unmounting on close; the height animates in JS, as the native driver can't animate layout. */
export const useInlineExpand = (visible: boolean, duration: number): InlineExpand => {
  const { mounted, progress } = usePresence({ visible, duration, native: false });
  const [height, setHeight] = useState(0);
  const onLayout = useCallback((e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height), []);
  const style = useMemo(
    () => ({
      height: progress.interpolate({ inputRange: [0, 1], outputRange: [0, height] }),
      opacity: progress,
    }),
    [height, progress]
  );

  return {
    mounted,
    style,
    onLayout,
  };
};
