import { FlatList, Text, View } from 'react-native';

import { textStyle, usePickerTheme } from '../core';
import { OwnScroll } from '../core/components/OwnScroll';
import { SHOWS_SCROLL_INDICATOR } from '../core/core.constants';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { CategoryBar } from './components/CategoryBar';
import { EmojiGridRow } from './components/EmojiGridRow';
import { EmojiHeader } from './components/EmojiHeader';
import { SectionHeader } from './components/SectionHeader';
import { SkinToneMenu } from './components/SkinToneMenu';
import {
  CATEGORY_BAR_POSITION,
  DEFAULT_CATEGORY_ICONS,
  DEFAULT_CATEGORY_LABELS,
  DEFAULT_COLUMNS,
  DEFAULT_EMPTY_TEXT,
  DEFAULT_HEIGHT,
  DEFAULT_MAX_RECENT,
  DEFAULT_SEARCH_PLACEHOLDER,
  EMOJI_CATEGORIES,
  EMOJI_DESIGN,
  EMOJI_ROW_TYPE,
} from './emoji.constants';
import { styles } from './emoji.styles';
import type { EmojiPickerProps, EmojiRow } from './emoji.types';
import { getEmojiFontSize, getInitialRowCount, getRowKey, getVisibleTabs } from './emoji.utils';
import { useEmojiGrid } from './hooks/useEmojiGrid';
import { useEmojiSelection } from './hooks/useEmojiSelection';

export const EmojiPicker = (props: EmojiPickerProps) => {
  const {
    columns = DEFAULT_COLUMNS,
    emojiSize,
    height = DEFAULT_HEIGHT,
    categories = EMOJI_CATEGORIES,
    exclude,
    maxEmojiVersion,
    searchable = true,
    searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
    emptyText = DEFAULT_EMPTY_TEXT,
    showCategoryBar = true,
    categoryBarPosition: categoryBarPositionProp = CATEGORY_BAR_POSITION.auto,
    showSectionHeaders = true,
    categoryLabels,
    categoryIcons,
    showSkinTones = true,
    showRecent = true,
    maxRecent = DEFAULT_MAX_RECENT,
    renderEmoji,
    style,
    styles: slots,
    theme: themeProp,
    design,
    testID,
  } = props;
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const categoryBarPosition =
    categoryBarPositionProp === CATEGORY_BAR_POSITION.auto ? EMOJI_DESIGN[theme.design].categoryBarPosition : categoryBarPositionProp;
  const selection = useEmojiSelection(props, showRecent, maxRecent);
  const grid = useEmojiGrid({
    recent: selection.recent,
    categories,
    exclude,
    maxEmojiVersion,
    showRecent,
    showSectionHeaders,
    columns,
  });
  const fontSize = getEmojiFontSize(grid.cellSize, emojiSize);
  const labels = { ...DEFAULT_CATEGORY_LABELS, ...categoryLabels };

  const renderRow = ({ item }: { item: EmojiRow }) =>
    item.type === EMOJI_ROW_TYPE.header ? (
      <SectionHeader label={labels[item.key]} theme={theme} slots={slots} />
    ) : (
      <EmojiGridRow
        items={item.items}
        tone={selection.tone}
        size={grid.cellSize}
        fontSize={fontSize}
        renderEmoji={renderEmoji}
        onSelect={selection.select}
        theme={theme}
        slots={slots}
      />
    );

  const categoryBar = showCategoryBar && !grid.query && (
    <CategoryBar
      tabs={getVisibleTabs(categories, grid.headerIndex)}
      active={grid.active}
      position={categoryBarPosition}
      labels={labels}
      icons={{ ...DEFAULT_CATEGORY_ICONS, ...categoryIcons }}
      onSelect={grid.jumpTo}
      theme={theme}
      slots={slots}
    />
  );

  return (
    <View style={[{ height, backgroundColor: theme.colors.background }, style, slots?.container]} {...ARROW_FOCUS} testID={testID}>
      {(searchable || showSkinTones) && (
        <EmojiHeader
          searchable={searchable}
          showSkinTones={showSkinTones}
          query={grid.query}
          onQueryChange={grid.search}
          searchPlaceholder={searchPlaceholder}
          tone={selection.tone}
          onToneButtonPress={selection.toggleToneMenu}
          theme={theme}
          slots={slots}
        />
      )}
      {selection.toneMenuOpen && <SkinToneMenu tone={selection.tone} onSelect={selection.pickTone} theme={theme} slots={slots} />}
      {categoryBarPosition === CATEGORY_BAR_POSITION.top && categoryBar}
      <View
        style={[styles.flex, { paddingHorizontal: theme.spacing.xs }]}
        onLayout={grid.onLayout}
        testID={testID ? `${testID}-grid` : undefined}
      >
        {grid.measured && (
          <OwnScroll>
            <FlatList
              ref={grid.listRef}
              data={grid.rows}
              showsVerticalScrollIndicator={SHOWS_SCROLL_INDICATOR}
              renderItem={renderRow}
              keyExtractor={getRowKey}
              getItemLayout={grid.getItemLayout}
              onScroll={grid.onScroll}
              scrollEventThrottle={32}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={getInitialRowCount(height, grid.cellSize)}
              maxToRenderPerBatch={8}
              windowSize={7}
              ListEmptyComponent={
                <View style={[styles.empty, { padding: theme.spacing.xl }, slots?.empty]}>
                  <Text style={[textStyle(theme, 'md'), { color: theme.colors.textSecondary }, slots?.emptyText]}>{emptyText}</Text>
                </View>
              }
            />
          </OwnScroll>
        )}
      </View>
      {categoryBarPosition === CATEGORY_BAR_POSITION.bottom && categoryBar}
    </View>
  );
};
