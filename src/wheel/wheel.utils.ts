import type React from 'react';

import {
  ALIGN_TOLERANCE_PX,
  EDGE_ANGLE_MARGIN_RAD,
  FLAT_UNSELECTED_SCALE,
  LOOP_MIN_COPIES,
  LOOP_MIN_ROWS,
  SETTLE_KIND,
  WHEEL_VARIANT,
} from './wheel.constants';
import type { MultiWheelPickerProps, RowFrames, SettleResult, WheelItem, WheelItemInput, WheelLayout, WheelVariant } from './wheel.types';

type Disableable = { disabled?: boolean };

export const normalizeItem = <T>(input: WheelItemInput<T>): WheelItem<T> => {
  if (typeof input === 'object' && input !== null && 'value' in input) return input as WheelItem<T>;
  return {
    label: String(input),
    value: input as unknown as T,
  };
};

export const firstItemValue = <T>(items: ReadonlyArray<WheelItemInput<T>>): T | undefined => {
  const first = items[0];
  return first === undefined ? undefined : normalizeItem(first).value;
};

export const toOddCount = (count: number) => (count % 2 === 0 ? count + 1 : count);

export const wrapIndex = (dataIndex: number, length: number) => ((dataIndex % length) + length) % length;

export const nearestEnabled = (items: ReadonlyArray<Disableable>, from: number) => {
  for (let d = 1; d < items.length; d++) {
    if (items[from + d] && !items[from + d]?.disabled) return from + d;
    if (items[from - d] && !items[from - d]?.disabled) return from - d;
  }
  return from;
};

export const firstEnabled = (items: ReadonlyArray<Disableable>, from: number) =>
  items[from]?.disabled ? nearestEnabled(items, from) : from;

export const getLoopLayout = (count: number, loop: boolean): WheelLayout => {
  const copies = loop && count > 0 ? Math.max(LOOP_MIN_COPIES, 2 * Math.ceil(LOOP_MIN_ROWS / count) + 1) : 1;
  return {
    copies,
    middle: Math.floor(copies / 2) * count,
    total: count * copies,
  };
};

export const offsetToIndex = (y: number, itemHeight: number, total: number) => Math.min(total - 1, Math.max(0, Math.round(y / itemHeight)));

/** Data index of logical item `logicalIndex` on the same lap as `currentDataIndex`. */
export const alignToLap = (currentDataIndex: number, logicalIndex: number, count: number, loop: boolean) =>
  loop ? currentDataIndex - wrapIndex(currentDataIndex, count) + logicalIndex : logicalIndex;

export const isNumericWheel = (items: ReadonlyArray<{ label: string }>) => items.length > 0 && items.every((it) => /^\d+$/.test(it.label));

/**
 * Decides what to do once scrolling stops at offset `y`: snap to a row (off-grid or disabled),
 * or rest there, reporting whether the value changed and whether a loop should jump back to the middle copy.
 */
export const getSettleResult = (params: {
  y: number;
  itemHeight: number;
  items: ReadonlyArray<Disableable>;
  committed: number;
  loop: boolean;
  layout: WheelLayout;
}): SettleResult => {
  const { y, itemHeight, items, committed, loop, layout } = params;
  const count = items.length;
  const dataIndex = offsetToIndex(y, itemHeight, layout.total);
  const logicalIndex = wrapIndex(dataIndex, count);

  if (items[logicalIndex]?.disabled) {
    const target = nearestEnabled(items, logicalIndex);
    if (target !== logicalIndex)
      return {
        kind: SETTLE_KIND.snap,
        dataIndex: dataIndex + (target - logicalIndex),
      };
  }
  if (Math.abs(y - dataIndex * itemHeight) > ALIGN_TOLERANCE_PX)
    return {
      kind: SETTLE_KIND.snap,
      dataIndex,
    };

  const nearLoopEdge = loop && (dataIndex < count || dataIndex >= layout.total - count);
  return {
    kind: SETTLE_KIND.rest,
    logicalIndex,
    changed: logicalIndex !== committed,
    recenterTo: nearLoopEdge ? layout.middle + logicalIndex : null,
  };
};

/**
 * Keyframes for one row's scroll-driven animation, sampled one row apart around its centre.
 * The 3d variant projects rows onto a cylinder, so rows bunch up toward the edges.
 */
export const getRowFrames = (params: {
  dataIndex: number;
  itemHeight: number;
  visibleItems: number;
  variant: WheelVariant;
  rotation: number;
  fadeTo: number;
}): RowFrames => {
  const { dataIndex, itemHeight: h, visibleItems, variant, rotation, fadeTo } = params;
  const range = (visibleItems - 1) / 2 + 1;
  const center = dataIndex * h;
  const ks: number[] = [];
  for (let k = range; k >= -range; k--) ks.push(k); // y ascending ⇒ k descending
  const inputRange = ks.map((k) => center - k * h);
  const opacity = ks.map((k) => 1 - (1 - fadeTo) * Math.min(1, Math.abs(k) / range));

  if (variant === WHEEL_VARIANT.flat) {
    return {
      inputRange,
      opacity,
      scale: ks.map((k) => (k === 0 ? 1 : FLAT_UNSELECTED_SCALE)),
    };
  }

  const step = (rotation * Math.PI) / 180;
  const radius = h / step;
  const maxAngle = Math.PI / 2 - EDGE_ANGLE_MARGIN_RAD;
  const angle = (k: number) => Math.max(-maxAngle, Math.min(maxAngle, k * step));
  return {
    inputRange,
    opacity,
    scale: ks.map((k) => 0.9 + 0.1 * Math.cos(angle(k))),
    translateY: ks.map((k) => radius * Math.sin(angle(k)) - k * h),
    rotateX: ks.map((k) => `${(-angle(k) * 180) / Math.PI}deg`),
  };
};

/** What to render before column `columnIndex`; null when nothing should be rendered. */
export const resolveSeparator = (separator: MultiWheelPickerProps['separator'], columnIndex: number): React.ReactNode => {
  if (columnIndex === 0 || separator === undefined) return null;
  const node = typeof separator === 'function' ? separator(columnIndex - 1) : separator;
  return node === undefined || node === false ? null : node;
};

/** Label of the item holding `value`, or '' when none does. */
export const getItemLabel = <T>(
  items: ReadonlyArray<WheelItemInput<T>>,
  value: T | undefined,
  isEqual: (a: T, b: T) => boolean = Object.is
) => (value === undefined ? '' : (items.map(normalizeItem).find((item) => isEqual(item.value, value))?.label ?? ''));
