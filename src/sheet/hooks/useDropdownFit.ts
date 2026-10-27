import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet } from 'react-native';

import { DROPDOWN_PADDING, PICKER_DROPDOWN_MAX_HEIGHT } from '../sheet.constants';

/** Measures a picker's dropdown, so it opens on the side of the field with room for all of it, and only once it knows which. */
export const useDropdownFit = () => {
  const [content, setContent] = useState(0);
  const [footer, setFooter] = useState(0);
  return {
    measured: content > 0,
    height: content ? Math.ceil(content + footer + (DROPDOWN_PADDING + StyleSheet.hairlineWidth) * 2) : PICKER_DROPDOWN_MAX_HEIGHT,
    onContentSizeChange: (_width: number, contentHeight: number) => setContent(contentHeight),
    onFooterLayout: (e: LayoutChangeEvent) => setFooter(e.nativeEvent.layout.height),
  };
};
