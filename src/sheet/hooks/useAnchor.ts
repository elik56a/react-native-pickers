import { useCallback, useRef, useState } from 'react';
import type { HostInstance } from 'react-native';

import type { AnchorRect, FieldAnchor } from '../sheet.types';

/** The field a dropdown opens from: attach `ref` to it and call `measure` on open. */
export const useAnchor = (): FieldAnchor => {
  const ref = useRef<HostInstance>(null);
  const [rect, setRect] = useState<AnchorRect | null>(null);

  const measure = useCallback(
    () =>
      ref.current?.measureInWindow((x, y, width, height) =>
        setRect({
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
    rect,
    measure,
  };
};
