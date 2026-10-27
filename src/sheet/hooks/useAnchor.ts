import type { ComponentRef } from 'react';
import { useCallback, useRef, useState } from 'react';
import type { View } from 'react-native';

import type { AnchorRect } from '../sheet.types';

/** The field a dropdown opens from: attach `ref` to it and call `measure` on open. */
export const useAnchor = () => {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);

  const measure = useCallback(
    () =>
      ref.current?.measureInWindow((x, y, width, height) =>
        setAnchor({
          x,
          y,
          width,
          height,
        })
      ),
    []
  );

  return {
    ref,
    anchor,
    measure,
  };
};
