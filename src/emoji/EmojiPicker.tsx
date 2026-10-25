import type React from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import { textStyle, usePickerTheme } from '../core';
import { OwnScroll } from '../core/components/OwnScroll';
import { useControllableState } from '../core/hooks/useControllableState';
import type { Emoji, EmojiCategory, SkinTone } from './emojis';
import {
  DEFAULT_CATEGORY_ICONS,
  DEFAULT_CATEGORY_LABELS,
  EMOJI_CATEGORIES,
  findEmoji,
  getAllEmojis,
  searchEmojis,
  withSkinTone,
} from './emojis';

type SectionKey = EmojiCategory | 'recent' | 'search';

export type EmojiPickerSlot =
  | 'container'
  | 'header'
  | 'searchInput'
  | 'skinToneButton'
  | 'skinToneMenu'
  | 'categoryBar'
  | 'categoryTab'
  | 'activeCategoryTab'
  | 'categoryIndicator'
  | 'sectionHeader'
  | 'sectionHeaderText'
  | 'emojiCell'
  | 'emojiText'
  | 'empty'
  | 'emptyText';

export interface EmojiPickerProps extends ThemableProps {
  onSelect: (emoji: string, data: Emoji) => void;
  /** Emojis per row. Default: 8 */
  columns?: number;
  /** Font size of emojis. Default: ~60% of the cell */
  emojiSize?: number;
  /** Height of the picker. Default: 380 */
  height?: number;
  /** Which categories to show, in order */
  categories?: EmojiCategory[];
  /** Emoji characters to hide */
  exclude?: string[];
  /** Hide emojis newer than this Emoji version (older Android can't render them). */
  maxEmojiVersion?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  showCategoryBar?: boolean;
  categoryBarPosition?: 'top' | 'bottom';
  showSectionHeaders?: boolean;
  categoryLabels?: Partial<Record<SectionKey, string>>;
  categoryIcons?: Partial<Record<EmojiCategory | 'recent', React.ReactNode>>;
  /** Controlled skin tone (0 default, 1–5 light → dark) */
  skinTone?: SkinTone;
  defaultSkinTone?: SkinTone;
  onSkinToneChange?: (tone: SkinTone) => void;
  showSkinTones?: boolean;
  /** Recently used emojis (characters). Persist with onRecentChange. */
  recent?: string[];
  defaultRecent?: string[];
  onRecentChange?: (recent: string[]) => void;
  showRecent?: boolean;
  maxRecent?: number;
  renderEmoji?: (emoji: string, data: Emoji, size: number) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<EmojiPickerSlot>;
  testID?: string;
}

type Row = { type: 'header'; key: SectionKey } | { type: 'emojis'; items: Emoji[]; section: SectionKey };

const HEADER_H = 32;
const TONE_SWATCH = ['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿'];

export function EmojiPicker({
  onSelect,
  columns = 8,
  emojiSize,
  height = 380,
  categories = EMOJI_CATEGORIES,
  exclude,
  maxEmojiVersion,
  searchable = true,
  searchPlaceholder = 'Search emoji',
  emptyText = 'No emoji found',
  showCategoryBar = true,
  categoryBarPosition = 'top',
  showSectionHeaders = true,
  categoryLabels,
  categoryIcons,
  skinTone: skinToneProp,
  defaultSkinTone = 0,
  onSkinToneChange,
  showSkinTones = true,
  recent: recentProp,
  defaultRecent = [],
  onRecentChange,
  showRecent = true,
  maxRecent = 24,
  renderEmoji,
  style,
  styles: slots,
  theme: themeOverride,
  testID,
}: EmojiPickerProps) {
  const theme = usePickerTheme(themeOverride);
  const c = theme.colors;
  const [width, setWidth] = useState(0);
  const [query, setQuery] = useState('');
  const [toneMenu, setToneMenu] = useState(false);
  const [tone, setSkinTone] = useControllableState(skinToneProp, defaultSkinTone, onSkinToneChange);
  const [recent, setRecent] = useControllableState(recentProp, defaultRecent, onRecentChange);
  const [active, setActive] = useState<SectionKey>(categories[0] ?? 'smileys');
  const listRef = useRef<FlatList<Row>>(null);
  const jumping = useRef(false);

  const cell = width > 0 ? Math.floor(width / columns) : 40;
  const fontSize = emojiSize ?? Math.round(cell * 0.62);
  const labels = { ...DEFAULT_CATEGORY_LABELS, ...categoryLabels };
  const icons = { ...DEFAULT_CATEGORY_ICONS, ...categoryIcons };

  const pool = useMemo(() => {
    const ex = exclude ? new Set(exclude) : null;
    const cats = new Set(categories);
    return getAllEmojis().filter(
      (e) => cats.has(e.category) && (maxEmojiVersion === undefined || e.version <= maxEmojiVersion) && !(ex && ex.has(e.emoji))
    );
  }, [categories, exclude, maxEmojiVersion]);

  const recentEmojis = useMemo(() => recent.map((ch) => findEmoji(ch)).filter((e): e is Emoji => !!e && pool.includes(e)), [pool, recent]);

  const sections = useMemo(() => {
    if (query.trim()) return [{ key: 'search' as SectionKey, items: searchEmojis(query, pool) }];
    const out: { key: SectionKey; items: Emoji[] }[] = [];
    if (showRecent && recentEmojis.length) out.push({ key: 'recent', items: recentEmojis });
    for (const cat of categories) {
      const items = pool.filter((e) => e.category === cat);
      if (items.length) out.push({ key: cat, items });
    }
    return out;
  }, [categories, pool, query, recentEmojis, showRecent]);

  // Flatten into rows with known heights so we can jump to categories.
  const { rows, offsets, headerIndex } = useMemo(() => {
    const rows: Row[] = [];
    const offsets: number[] = [];
    const headerIndex = new Map<SectionKey, number>();
    let y = 0;
    for (const sec of sections) {
      if (showSectionHeaders || sec.key !== 'search') {
        headerIndex.set(sec.key, rows.length);
        if (showSectionHeaders) {
          rows.push({ type: 'header', key: sec.key });
          offsets.push(y);
          y += HEADER_H;
        }
      }
      for (let i = 0; i < sec.items.length; i += columns) {
        if (!showSectionHeaders && i === 0) headerIndex.set(sec.key, rows.length);
        rows.push({ type: 'emojis', items: sec.items.slice(i, i + columns), section: sec.key });
        offsets.push(y);
        y += cell;
      }
    }
    return { rows, offsets, headerIndex };
  }, [cell, columns, sections, showSectionHeaders]);

  const rowLength = useCallback((r: Row) => (r.type === 'header' ? HEADER_H : cell), [cell]);

  const select = useCallback(
    (e: Emoji) => {
      const ch = withSkinTone(e, tone);
      onSelect(ch, e);
      if (showRecent) {
        const next = [e.emoji, ...recent.filter((r) => findEmoji(r) !== e)].slice(0, maxRecent);
        setRecent(next);
      }
    },
    [maxRecent, onSelect, recent, setRecent, showRecent, tone]
  );

  const setTone = (t: SkinTone) => {
    setSkinTone(t);
    setToneMenu(false);
  };

  const jumpTo = (key: SectionKey) => {
    const idx = headerIndex.get(key);
    if (idx === undefined) return;
    setActive(key);
    jumping.current = true;
    listRef.current?.scrollToOffset({ offset: offsets[idx] ?? 0, animated: true });
    setTimeout(() => (jumping.current = false), 450);
  };

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (jumping.current || query) return;
      const y = e.nativeEvent.contentOffset.y + 4;
      // binary search the row at y
      let lo = 0;
      let hi = offsets.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (offsets[mid]! <= y) lo = mid;
        else hi = mid - 1;
      }
      const r = rows[lo];
      const key = r ? (r.type === 'header' ? r.key : r.section) : undefined;
      if (key && key !== active) setActive(key);
    },
    [active, offsets, query, rows]
  );

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const renderRow = ({ item }: { item: Row }) => {
    if (item.type === 'header') {
      return (
        <View style={[{ height: HEADER_H, justifyContent: 'flex-end', paddingHorizontal: 4, paddingBottom: 6 }, slots?.sectionHeader]}>
          <Text style={[textStyle(theme, 'xs', 'bold'), { color: c.textSecondary }, slots?.sectionHeaderText]}>{labels[item.key]}</Text>
        </View>
      );
    }
    return (
      <View style={s.row}>
        {item.items.map((e) => (
          <EmojiCell
            key={e.emoji}
            e={e}
            ch={withSkinTone(e, tone)}
            size={cell}
            fontSize={fontSize}
            theme={theme}
            slots={slots}
            renderEmoji={renderEmoji}
            onPress={select}
          />
        ))}
      </View>
    );
  };

  const categoryBar = showCategoryBar && !query && (
    <View
      style={[
        s.bar,
        { borderColor: c.border },
        categoryBarPosition === 'top' ? { borderBottomWidth: StyleSheet.hairlineWidth } : { borderTopWidth: StyleSheet.hairlineWidth },
        slots?.categoryBar,
      ]}
    >
      {(['recent', ...categories] as const)
        .filter((k) => headerIndex.has(k))
        .map((k) => {
          const on = active === k;
          const icon = icons[k as EmojiCategory | 'recent'];
          return (
            <Pressable
              key={k}
              onPress={() => jumpTo(k)}
              accessibilityRole="tab"
              accessibilityLabel={labels[k]}
              accessibilityState={{ selected: on }}
              style={[s.tab, slots?.categoryTab, on && slots?.activeCategoryTab]}
            >
              {typeof icon === 'string' ? <Text style={{ fontSize: 18, opacity: on ? 1 : 0.45 }}>{icon}</Text> : icon}
              <View
                style={[
                  s.tabIndicator,
                  { backgroundColor: on ? c.primary : 'transparent', [categoryBarPosition === 'top' ? 'bottom' : 'top']: 0 },
                  slots?.categoryIndicator,
                ]}
              />
            </Pressable>
          );
        })}
    </View>
  );

  return (
    <View style={[{ height, backgroundColor: c.background }, style, slots?.container]} testID={testID}>
      {(searchable || showSkinTones) && (
        <View
          style={[s.header, { paddingHorizontal: theme.spacing.sm, paddingTop: theme.spacing.sm, gap: theme.spacing.sm }, slots?.header]}
        >
          {searchable ? (
            <TextInput
              value={query}
              onChangeText={(t) => {
                setQuery(t);
                listRef.current?.scrollToOffset({ offset: 0, animated: false });
              }}
              placeholder={searchPlaceholder}
              placeholderTextColor={c.textSecondary}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              accessibilityLabel={searchPlaceholder}
              style={[
                textStyle(theme, 'md'),
                s.flex,
                { backgroundColor: c.surface, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, height: 40 },
                slots?.searchInput,
              ]}
            />
          ) : (
            <View style={s.flex} />
          )}
          {showSkinTones && (
            <Pressable
              onPress={() => setToneMenu((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel="Skin tone"
              style={[s.toneBtn, { backgroundColor: c.surface, borderRadius: theme.radius.md }, slots?.skinToneButton]}
            >
              <Text style={{ fontSize: 20 }}>{TONE_SWATCH[tone]}</Text>
            </Pressable>
          )}
        </View>
      )}
      {toneMenu && (
        <View
          style={[
            s.toneMenu,
            { marginHorizontal: theme.spacing.sm, backgroundColor: c.surface, borderRadius: theme.radius.md },
            slots?.skinToneMenu,
          ]}
        >
          {TONE_SWATCH.map((sw, i) => (
            <Pressable
              key={i}
              onPress={() => setTone(i as SkinTone)}
              accessibilityRole="button"
              accessibilityState={{ selected: i === tone }}
              style={[s.toneOpt, { borderRadius: theme.radius.sm, backgroundColor: i === tone ? c.primaryMuted : 'transparent' }]}
            >
              <Text style={{ fontSize: 22 }}>{sw}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {categoryBarPosition === 'top' && categoryBar}
      <View style={[s.flex, { paddingHorizontal: theme.spacing.xs }]} onLayout={onLayout}>
        {width > 0 && (
          <OwnScroll>
            <FlatList
              ref={listRef}
              data={rows}
              renderItem={renderRow}
              keyExtractor={(r, i) => (r.type === 'header' ? `h-${r.key}` : `r-${r.section}-${i}`)}
              getItemLayout={(_, i) => ({ index: i, length: rows[i] ? rowLength(rows[i]!) : cell, offset: offsets[i] ?? 0 })}
              onScroll={onScroll}
              scrollEventThrottle={32}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={Math.ceil(height / cell) + 2}
              maxToRenderPerBatch={8}
              windowSize={7}
              ListEmptyComponent={
                <View style={[{ padding: theme.spacing.xl, alignItems: 'center' }, slots?.empty]}>
                  <Text style={[textStyle(theme, 'md'), { color: c.textSecondary }, slots?.emptyText]}>{emptyText}</Text>
                </View>
              }
            />
          </OwnScroll>
        )}
      </View>
      {categoryBarPosition === 'bottom' && categoryBar}
    </View>
  );
}

interface CellProps {
  e: Emoji;
  ch: string;
  size: number;
  fontSize: number;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
  renderEmoji?: (emoji: string, data: Emoji, size: number) => React.ReactNode;
  onPress: (e: Emoji) => void;
}

const EmojiCell = memo(function EmojiCell({ e, ch, size, fontSize, theme, slots, renderEmoji, onPress }: CellProps) {
  return (
    <Pressable
      onPress={() => onPress(e)}
      accessibilityRole="button"
      accessibilityLabel={e.name}
      style={({ pressed }) => [
        { width: size, height: size, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.sm },
        pressed && { backgroundColor: theme.colors.surface, transform: [{ scale: 1.15 }] },
        slots?.emojiCell,
      ]}
    >
      {renderEmoji ? renderEmoji(ch, e, fontSize) : <Text style={[{ fontSize, lineHeight: fontSize * 1.2 }, slots?.emojiText]}>{ch}</Text>}
    </Pressable>
  );
});

const s = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row' },
  header: { flexDirection: 'row', alignItems: 'center' },
  toneBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  toneMenu: { flexDirection: 'row', justifyContent: 'space-around', padding: 4, marginTop: 6 },
  toneOpt: { padding: 6 },
  bar: { flexDirection: 'row', marginTop: 6 },
  tab: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' },
  tabIndicator: { position: 'absolute', left: '25%', right: '25%', height: 2.5, borderRadius: 2 },
});
