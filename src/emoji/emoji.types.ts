import type React from 'react';
import type { RefObject } from 'react';
import type { HostInstance, StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { SheetChromeProps, WithPickerField } from '../sheet';
import type { ACTIVE_TAB, CATEGORY_BAR_POSITION, EMOJI_CATEGORY, EMOJI_ROW_TYPE, EMOJI_SECTION } from './emoji.constants';

export type EmojiCategory = ValueOf<typeof EMOJI_CATEGORY>;

export type CategoryBarPosition = ValueOf<typeof CATEGORY_BAR_POSITION>;

/** Where the bar ends up once `auto` is resolved. */
export type CategoryBarSide = Exclude<CategoryBarPosition, typeof CATEGORY_BAR_POSITION.auto>;

export type ActiveTab = ValueOf<typeof ACTIVE_TAB>;

export interface EmojiDesign {
  categoryBarPosition: CategoryBarSide;
  activeTab: ActiveTab;
  uppercaseSectionHeaders: boolean;
}

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

export type EmojiTabKey = EmojiCategory | typeof EMOJI_SECTION.recent;

export type EmojiSectionKey = EmojiTabKey | typeof EMOJI_SECTION.search;

export type EmojiPickerSlot =
  | 'container'
  | 'header'
  | 'searchInput'
  | 'skinToneButton'
  | 'skinToneMenu'
  | 'skinTonePopover'
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
  /** 'auto': at the bottom in the iOS and Material designs, like their emoji keyboards, and on top on the web. Default: 'auto' */
  categoryBarPosition?: CategoryBarPosition;
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
  /** The characters to show instead of the items in the current skin tone: recents, as they were picked. */
  chars?: string[];
}

export interface RecentEmojis {
  items: Emoji[];
  chars: string[];
}

export type EmojiRow =
  | { type: typeof EMOJI_ROW_TYPE.header; key: EmojiSectionKey }
  | { type: typeof EMOJI_ROW_TYPE.emojis; items: Emoji[]; chars?: string[]; section: EmojiSectionKey };

/** Rows with their y offsets, and the row each section starts at (so the category bar can jump to it). */
export interface EmojiLayout {
  rows: EmojiRow[];
  offsets: number[];
  headerIndex: Map<EmojiSectionKey, number>;
}

export interface EmojiSectionsOptions {
  query: string;
  pool: Emoji[];
  recent: RecentEmojis;
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

export interface EmojiGlyphProps {
  emoji: Emoji;
  char: string;
  fontSize: number;
  renderEmoji?: EmojiRenderer;
  slots?: SlotStyles<EmojiPickerSlot>;
}

export interface EmojiCellProps {
  emoji: Emoji;
  char: string;
  size: number;
  fontSize: number;
  renderEmoji?: EmojiRenderer;
  /** Gets the character the cell shows. */
  onSelect: (emoji: Emoji, char: string) => void;
  /** Opens the emoji's skin tones; the row passes it only to emojis that have them. */
  onLongPress?: (emoji: Emoji) => void;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
}

/** A long press on the emoji at `index` in a row; the row is measured to place the skin tone popover over it. */
export type EmojiLongPress = (emoji: Emoji, row: HostInstance | null, index: number) => void;

export type EmojiGridRowProps = Omit<EmojiCellProps, 'emoji' | 'char' | 'onLongPress'> & {
  items: Emoji[];
  /** Shown instead of the items in `tone` */
  chars?: string[];
  tone: SkinTone;
  onLongPress?: EmojiLongPress;
};

/** The long-pressed emoji, and where its skin tone popover sits inside the picker. */
export interface TonePopoverTarget {
  emoji: Emoji;
  left: number;
  top: number;
}

export interface TonePopover {
  rootRef: RefObject<HostInstance | null>;
  target: TonePopoverTarget | null;
  open: EmojiLongPress;
  close: () => void;
  pick: (tone: SkinTone) => void;
}

export interface SkinTonePopoverProps extends TonePopoverTarget {
  size: number;
  fontSize: number;
  renderEmoji?: EmojiRenderer;
  onSelect: (tone: SkinTone) => void;
  onClose: () => void;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
}

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
  position: CategoryBarSide;
  labels: Record<EmojiSectionKey, string>;
  icons: Partial<Record<EmojiTabKey, React.ReactNode>>;
  onSelect: (key: EmojiTabKey) => void;
  theme: PickerTheme;
  slots?: SlotStyles<EmojiPickerSlot>;
}
