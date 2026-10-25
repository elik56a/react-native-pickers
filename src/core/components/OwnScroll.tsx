import type React from 'react';
import { ScrollView } from 'react-native';

// Absent on react-native-web.
const ParentScrollContext = (ScrollView as unknown as { Context?: React.Context<unknown> }).Context;

/**
 * Wraps a fixed-height list that scrolls on its own. Its windowing never depends on an outer
 * ScrollView, so hiding that parent silences VirtualizedList's "should never be nested" warning
 * (the context is only read for that warning).
 */
export const OwnScroll = ({ children }: { children: React.ReactNode }) => {
  return ParentScrollContext ? <ParentScrollContext.Provider value={null}>{children}</ParentScrollContext.Provider> : <>{children}</>;
};
