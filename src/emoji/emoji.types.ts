import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { SheetChromeProps, WithPickerField } from '../sheet';

export type EmojiCategory = 'smileys' | 'people' | 'animals' | 'food' | 'travel' | 'activities' | 'objects' | 'symbols' | 'flags';

export interface Emoji {
  emoji: string;
  name: string;
  keywords: string[];
  category: EmojiCategory;
  /** Emoji (Unicode) version it was introduced in */
  version: number;
  /** Variants for skin tones 1–5 (light → dark) */
  skins?: string[];
}

/** Skin tone: 0 = default (yellow), 1–5 = light → dark */
export type SkinTone = 0 | 1 | 2 | 3 | 4 | 5;

export type EmojiTabKey = EmojiCategory | 'recent';

export type EmojiSectionKey = EmojiTabKey | 'search';

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

export type EmojiRenderer = (emoji: string, data: Emoji, size: number) => React.ReactNode;

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
  categoryLabels?: Partial<Record<EmojiSectionKey, string>>;
  categoryIcons?: Partial<Record<EmojiTabKey, React.ReactNode>>;
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
  renderEmoji?: EmojiRenderer;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<EmojiPickerSlot>;
  testID?: string;
}

export type EmojiPickerSheetProps = SheetChromeProps &
  Omit<EmojiPickerProps, 'theme'> & {
    /** Close after picking an emoji. Default: true */
    closeOnSelect?: boolean;
  };

export type EmojiPickerFieldProps = WithPickerField<EmojiPickerSheetProps, EmojiPickerSlot> & {
  /** The picked emoji, shown in the field */
  value?: string;
};

export interface EmojiSection {
  key: EmojiSectionKey;
  items: Emoji[];
}

export type EmojiRow = { type: 'header'; key: EmojiSectionKey } | { type: 'emojis'; items: Emoji[]; section: EmojiSectionKey };

/** Rows with their y offsets, and the row each section starts at (so the category bar can jump to it). */
export interface EmojiLayout {
  rows: EmojiRow[];
  offsets: number[];
  headerIndex: Map<EmojiSectionKey, number>;
}

export interface EmojiSectionsOptions {
  query: string;
  pool: Emoji[];
  recent: Emoji[];
  showRecent: boolean;
  categories: EmojiCategory[];
}

export interface EmojiGridOptions {
  recent: string[];
  categories: EmojiCategory[];
  exclude?: string[];
  maxEmojiVersion?: number;
  showRecent: boolean;
  showSectionHeaders: boolean;
  columns: number;
}

export interface EmojiCellProps {
  emoji: Emoji;
  char: string;
  size: number;
  fontSize: number;
  renderEmoji?: EmojiRenderer;
  onSelect: (emoji: Emoji) => void;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
}

export type EmojiGridRowProps = Omit<EmojiCellProps, 'emoji' | 'char'> & {
  items: Emoji[];
  tone: SkinTone;
};

export interface SectionHeaderProps {
  label?: string;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
}

export interface EmojiHeaderProps {
  searchable: boolean;
  showSkinTones: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  searchPlaceholder: string;
  tone: SkinTone;
  onToneButtonPress: () => void;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
}

export interface SkinToneMenuProps {
  tone: SkinTone;
  onSelect: (tone: SkinTone) => void;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
}

export interface CategoryBarProps {
  tabs: EmojiTabKey[];
  active: EmojiSectionKey;
  position: 'top' | 'bottom';
  labels: Record<EmojiSectionKey, string>;
  icons: Partial<Record<EmojiTabKey, React.ReactNode>>;
  onSelect: (key: EmojiTabKey) => void;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
}
