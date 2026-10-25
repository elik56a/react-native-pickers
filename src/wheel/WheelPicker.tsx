import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AccessibilityActionEvent, NativeScrollEvent, NativeSyntheticEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Animated, type FlatList, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { PickerTheme } from '../theme';
import { textStyle, usePickerTheme } from '../theme';
import type { SlotStyles, ThemableProps } from '../types';
import { OwnScroll } from '../utils/OwnScroll';
import { canExtend, matchLabel } from './typeToSelect';

export interface WheelItem<T> {
  label: string;
  value: T;
  disabled?: boolean;
  key?: string;
}

export type WheelItemInput<T> = WheelItem<T> | (T extends string | number ? T : never);

export type WheelPickerSlot = 'container' | 'item' | 'itemText' | 'selectedItemText' | 'disabledItemText' | 'indicator';

export interface WheelRenderItemInfo<T> {
  item: WheelItem<T>;
  index: number;
  selected: boolean;
  theme: PickerTheme;
}

export interface WheelPickerProps<T> extends ThemableProps {
  /** Items: primitives (`[1, 2, 3]`) or objects (`{ label, value, disabled }`) */
  items: ReadonlyArray<WheelItemInput<T>>;
  /** Selected value (controlled). */
  value?: T;
  /** Initial value when uncontrolled. */
  defaultValue?: T;
  /** Fires when the wheel settles on a new value. */
  onChange?: (value: T, index: number) => void;
  /** Fires on every item crossing while scrolling. Hook haptics here. */
  onValueChanging?: (value: T, index: number) => void;
  /** Row height. Default: 40 */
  itemHeight?: number;
  /** Visible rows (odd number). Default: 5 */
  visibleItems?: number;
  /** Infinite wheel. Default: false */
  loop?: boolean;
  /** Tap the selected row to type a value; the wheel jumps to the first matching label. Default: true */
  keyboardInput?: boolean;
  /** '3d' cylinder or 'flat' list. Default: '3d' */
  variant?: '3d' | 'flat';
  /** Degrees between rows on the 3d cylinder. Default: 20 */
  rotation?: number;
  /** Opacity of the farthest visible rows. Default: 0.3 */
  fadeTo?: number;
  /** Custom row renderer. */
  renderItem?: (info: WheelRenderItemInfo<T>) => React.ReactNode;
  /** Show the selection band. Default: true */
  showIndicator?: boolean;
  renderIndicator?: (theme: PickerTheme) => React.ReactNode;
  textAlign?: TextStyle['textAlign'];
  disabled?: boolean;
  /** Custom equality for object values. Default: Object.is */
  isEqual?: (a: T, b: T) => boolean;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<WheelPickerSlot>;
  accessibilityLabel?: string;
  testID?: string;
}

function normalize<T>(input: WheelItemInput<T>): WheelItem<T> {
  if (typeof input === 'object' && input !== null && 'value' in (input as object)) return input as WheelItem<T>;
  return { label: String(input), value: input as unknown as T };
}

const native = Platform.OS !== 'web';

export function WheelPicker<T>(props: WheelPickerProps<T>) {
  const {
    items: rawItems,
    value,
    defaultValue,
    onChange,
    onValueChanging,
    itemHeight: h = 40,
    visibleItems = 5,
    loop = false,
    keyboardInput = true,
    variant = '3d',
    rotation = 20,
    fadeTo = 0.3,
    renderItem,
    showIndicator = true,
    renderIndicator,
    textAlign = 'center',
    disabled = false,
    isEqual = Object.is,
    style,
    styles: slots,
    theme: themeOverride,
    accessibilityLabel,
    testID,
  } = props;
  const theme = usePickerTheme(themeOverride);
  const items = useMemo(() => rawItems.map(normalize), [rawItems]);
  const n = items.length;
  const visible = visibleItems % 2 === 0 ? visibleItems + 1 : visibleItems;
  const pad = ((visible - 1) / 2) * h;

  // Loop: repeat the list so the user can keep scrolling; we silently recentre on settle.
  const copies = loop && n > 0 ? Math.max(7, 2 * Math.ceil(240 / n) + 1) : 1;
  const middle = Math.floor(copies / 2) * n;
  const total = n * copies;

  const indexOfValue = useCallback(
    (v: T | undefined) => {
      if (v === undefined) return -1;
      return items.findIndex((it) => isEqual(it.value, v));
    },
    [items, isEqual]
  );

  const initialLogical = Math.max(0, indexOfValue(value !== undefined ? value : defaultValue));
  const initialData = (loop ? middle : 0) + firstEnabled(items, initialLogical);

  const listRef = useRef<FlatList<number>>(null);
  const scrollY = useRef(new Animated.Value(initialData * h)).current;
  const [active, setActive] = useState(initialData);
  const st = useRef({
    tick: initialData,
    committed: initialData % Math.max(n, 1),
    y: initialData * h,
    dragging: false,
    momentum: false,
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
    mounted: false,
  }).current;

  const cbs = useRef({ onChange, onValueChanging });
  cbs.current = { onChange, onValueChanging };

  const logical = useCallback((dataIndex: number) => ((dataIndex % n) + n) % n, [n]);

  const scrollToData = useCallback(
    (dataIndex: number, animated: boolean) => {
      listRef.current?.scrollToOffset({ offset: dataIndex * h, animated });
      if (!animated) {
        st.y = dataIndex * h;
        st.tick = dataIndex;
        setActive(dataIndex);
      }
    },
    [h, st]
  );

  const settle = useCallback(() => {
    if (n === 0 || st.dragging || st.momentum) return;
    let idx = Math.min(total - 1, Math.max(0, Math.round(st.y / h)));
    const li = logical(idx);
    if (items[li]?.disabled) {
      const target = nearestEnabled(items, li);
      if (target !== li) {
        scrollToData(idx + (target - li), true);
        return;
      }
    }
    if (Math.abs(st.y - idx * h) > 1) {
      // Not aligned (web or interrupted momentum) – snap, settle will run again.
      scrollToData(idx, true);
      return;
    }
    if (li !== st.committed) {
      st.committed = li;
      const it = items[li];
      if (it) cbs.current.onChange?.(it.value, li);
    }
    if (loop && (idx < n || idx >= total - n)) {
      idx = middle + li;
      scrollToData(idx, false);
    }
  }, [h, items, logical, loop, middle, n, scrollToData, st, total]);

  const scheduleSettle = useCallback(
    (delay: number) => {
      if (st.timer) clearTimeout(st.timer);
      st.timer = setTimeout(settle, delay);
    },
    [settle, st]
  );

  useEffect(
    () => () => {
      if (st.timer) clearTimeout(st.timer);
    },
    [st]
  );

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: native,
        listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const y = e.nativeEvent.contentOffset.y;
          st.y = y;
          const idx = Math.min(total - 1, Math.max(0, Math.round(y / h)));
          if (idx !== st.tick) {
            st.tick = idx;
            setActive(idx);
            const it = items[logical(idx)];
            if (it && !it.disabled) cbs.current.onValueChanging?.(it.value, logical(idx));
          }
          scheduleSettle(native ? 140 : 110);
        },
      }),
    [h, items, logical, scheduleSettle, scrollY, st, total]
  );

  // Controlled value sync
  useEffect(() => {
    if (value === undefined || n === 0) return;
    const li = indexOfValue(value);
    if (li < 0 || li === logical(st.tick) || st.dragging || st.momentum) {
      if (li >= 0) st.committed = li;
      return;
    }
    st.committed = li;
    const base = st.tick - logical(st.tick);
    scrollToData(loop ? base + li : li, st.mounted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, items]);

  // Initial position (contentOffset is not honoured everywhere)
  const onLayout = useCallback(() => {
    if (st.mounted) return;
    st.mounted = true;
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: initialData * h, animated: false }));
  }, [h, initialData, st]);

  const data = useMemo(() => Array.from({ length: total }, (_, i) => i), [total]);

  const move = useCallback(
    (delta: number) => {
      const target = st.tick + delta;
      if (!loop && (target < 0 || target >= n)) return;
      scrollToData(target, true);
    },
    [loop, n, scrollToData, st]
  );

  // Typing only scrolls; settle() commits the value like a drag would.
  const [typed, setTyped] = useState<string | null>(null);
  const typing = typed !== null;
  const numeric = useMemo(() => n > 0 && items.every((it) => /^\d+$/.test(it.label)), [items, n]);
  const stopTyping = useCallback(() => setTyped(null), []);

  const onType = useCallback(
    (text: string) => {
      const q = text.trim().toLowerCase();
      if (!q) return setTyped('');
      const li = matchLabel(items, q, numeric);
      if (li < 0) return;
      scrollToData(loop ? st.tick - logical(st.tick) + li : li, true);
      setTyped(canExtend(items, q) ? text : null);
    },
    [items, logical, loop, numeric, scrollToData, st]
  );

  useEffect(() => {
    if (!typing) return;
    const sub = Keyboard.addListener('keyboardDidHide', stopTyping);
    return () => sub.remove();
  }, [typing, stopTyping]);

  const onRowPress = useCallback(
    (dataIndex: number) => {
      if (keyboardInput && dataIndex === st.tick) setTyped((t) => (t === null ? '' : null));
      else scrollToData(dataIndex, true);
    },
    [keyboardInput, scrollToData, st]
  );

  const onA11yAction = useCallback(
    (e: AccessibilityActionEvent) => {
      if (e.nativeEvent.actionName === 'increment') move(1);
      if (e.nativeEvent.actionName === 'decrement') move(-1);
    },
    [move]
  );

  const renderRow = useCallback(
    ({ item: dataIndex }: { item: number }) => {
      const li = logical(dataIndex);
      return (
        <WheelRow
          dataIndex={dataIndex}
          item={items[li]!}
          logicalIndex={li}
          selected={dataIndex === active}
          h={h}
          visible={visible}
          scrollY={scrollY}
          variant={variant}
          rotation={rotation}
          fadeTo={fadeTo}
          theme={theme}
          textAlign={textAlign}
          slots={slots}
          renderItem={renderItem}
          onPress={disabled ? undefined : onRowPress}
        />
      );
    },
    [active, disabled, fadeTo, h, items, logical, onRowPress, renderItem, rotation, scrollY, slots, textAlign, theme, variant, visible]
  );

  const current = items[logical(active)];

  return (
    <View
      style={[{ height: h * visible, overflow: 'hidden' }, style, slots?.container]}
      onLayout={onLayout}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: current?.label }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={onA11yAction}
      testID={testID}
    >
      {showIndicator && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { justifyContent: 'center' }]}>
          {renderIndicator ? (
            renderIndicator(theme)
          ) : (
            <View
              style={[
                { height: h, borderRadius: theme.radius.md, backgroundColor: theme.colors.indicator, marginHorizontal: theme.spacing.xs },
                slots?.indicator,
              ]}
            />
          )}
        </View>
      )}
      <OwnScroll>
        <Animated.FlatList
          ref={listRef as React.Ref<FlatList<number>>}
          data={data}
          keyExtractor={(i: number) => String(i)}
          renderItem={renderRow}
          extraData={active}
          getItemLayout={(_: unknown, index: number) => ({ length: h, offset: pad + h * index, index })}
          contentContainerStyle={{ paddingVertical: pad }}
          contentOffset={{ x: 0, y: initialData * h }}
          // iOS applies contentOffset without a scroll event, so the list would only render rows from 0.
          initialScrollIndex={Math.max(0, initialData - (visible - 1) / 2)}
          showsVerticalScrollIndicator={false}
          snapToInterval={h}
          decelerationRate="fast"
          scrollEnabled={!disabled}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => {
            st.dragging = true;
            stopTyping();
          }}
          onScrollEndDrag={() => {
            st.dragging = false;
            scheduleSettle(140);
          }}
          onMomentumScrollBegin={() => {
            st.momentum = true;
          }}
          onMomentumScrollEnd={() => {
            st.momentum = false;
            scheduleSettle(16);
          }}
          initialNumToRender={visible + 4}
          windowSize={5}
          maxToRenderPerBatch={visible * 2}
          removeClippedSubviews={false}
          nestedScrollEnabled
        />
      </OwnScroll>
      {typing && (
        <>
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { justifyContent: 'center' }]}>
            <View
              style={[
                s.typingRing,
                { height: h, borderRadius: theme.radius.md, borderColor: theme.colors.primary, marginHorizontal: theme.spacing.xs },
              ]}
            />
          </View>
          <TextInput
            autoFocus
            value={typed ?? ''}
            onChangeText={onType}
            onSubmitEditing={stopTyping}
            onBlur={stopTyping}
            keyboardType={numeric ? (Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'number-pad') : 'default'}
            returnKeyType="done"
            autoCorrect={false}
            autoCapitalize="none"
            caretHidden
            style={s.hiddenInput}
            accessibilityLabel={accessibilityLabel}
          />
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  typingRing: { borderWidth: 2 },
});

interface RowProps<T> {
  dataIndex: number;
  logicalIndex: number;
  item: WheelItem<T>;
  selected: boolean;
  h: number;
  visible: number;
  scrollY: Animated.Value;
  variant: '3d' | 'flat';
  rotation: number;
  fadeTo: number;
  theme: PickerTheme;
  textAlign: TextStyle['textAlign'];
  slots?: SlotStyles<WheelPickerSlot>;
  renderItem?: (info: WheelRenderItemInfo<T>) => React.ReactNode;
  onPress?: (dataIndex: number) => void;
}

function WheelRowImpl<T>({
  dataIndex,
  logicalIndex,
  item,
  selected,
  h,
  visible,
  scrollY,
  variant,
  rotation,
  fadeTo,
  theme,
  textAlign,
  slots,
  renderItem,
  onPress,
}: RowProps<T>) {
  const animatedStyle = useMemo(() => {
    const half = (visible - 1) / 2;
    const range = half + 1;
    const center = dataIndex * h;
    const ks: number[] = [];
    for (let k = range; k >= -range; k--) ks.push(k); // y ascending ⇒ k descending
    const inputRange = ks.map((k) => center - k * h);
    const fade = (k: number) => {
      const t = Math.min(1, Math.abs(k) / range);
      return 1 - (1 - fadeTo) * t;
    };
    const opacity = scrollY.interpolate({ inputRange, outputRange: ks.map(fade), extrapolate: 'clamp' });
    if (variant === 'flat') {
      const scale = scrollY.interpolate({ inputRange, outputRange: ks.map((k) => (k === 0 ? 1 : 0.94)), extrapolate: 'clamp' });
      return { opacity, transform: [{ scale }] };
    }
    const step = (rotation * Math.PI) / 180;
    const radius = h / step;
    const clampAngle = (k: number) => Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, k * step));
    // Project row onto a cylinder: rows bunch up toward the edges.
    const translateY = scrollY.interpolate({
      inputRange,
      outputRange: ks.map((k) => radius * Math.sin(clampAngle(k)) - k * h),
      extrapolate: 'clamp',
    });
    const rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ks.map((k) => `${(-clampAngle(k) * 180) / Math.PI}deg`),
      extrapolate: 'clamp',
    });
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: ks.map((k) => 0.9 + 0.1 * Math.cos(clampAngle(k))),
      extrapolate: 'clamp',
    });
    return { opacity, transform: [{ perspective: 1000 }, { translateY }, { rotateX }, { scale }] };
  }, [dataIndex, fadeTo, h, rotation, scrollY, variant, visible]);

  const content = renderItem ? (
    renderItem({ item, index: logicalIndex, selected, theme })
  ) : (
    <Text
      numberOfLines={1}
      style={[
        textStyle(theme, 'lg', selected ? 'bold' : 'regular'),
        { textAlign, color: item.disabled ? theme.colors.textDisabled : selected ? theme.colors.text : theme.colors.textSecondary },
        slots?.itemText,
        selected && slots?.selectedItemText,
        item.disabled && slots?.disabledItemText,
      ]}
    >
      {item.label}
    </Text>
  );

  return (
    <Pressable onPress={onPress && !item.disabled ? () => onPress(dataIndex) : undefined} accessible={false}>
      <Animated.View style={[{ height: h, justifyContent: 'center', paddingHorizontal: theme.spacing.sm }, animatedStyle, slots?.item]}>
        {content}
      </Animated.View>
    </Pressable>
  );
}

const WheelRow = memo(WheelRowImpl) as typeof WheelRowImpl;

function firstEnabled<T>(items: WheelItem<T>[], from: number) {
  return items[from]?.disabled ? nearestEnabled(items, from) : from;
}

function nearestEnabled<T>(items: WheelItem<T>[], from: number) {
  for (let d = 1; d < items.length; d++) {
    if (items[from + d] && !items[from + d]!.disabled) return from + d;
    if (items[from - d] && !items[from - d]!.disabled) return from - d;
  }
  return from;
}
