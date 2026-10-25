import { FlatList, Text, View } from 'react-native';

import { textStyle, usePickerTheme } from '../core';
import { SearchInput } from '../core/components/SearchInput';
import { SHOWS_SCROLL_INDICATOR } from '../core/core.constants';
import { GroupHeader } from './components/GroupHeader';
import { OptionRow } from './components/OptionRow';
import { useSelectList } from './hooks/useSelectList';
import { DEFAULT_EMPTY_TEXT, DEFAULT_SEARCH_PLACEHOLDER } from './select.constants';
import { styles } from './select.styles';
import type { SelectListProps, SelectRow } from './select.types';
import { defaultFilter, getRowKey, isOptionDisabled, shouldShowSearch } from './select.utils';

export const SelectList = <T,>(props: SelectListProps<T>) => {
  const {
    options,
    searchable,
    searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
    filterOption = defaultFilter,
    renderOption,
    renderGroupHeader,
    emptyText = DEFAULT_EMPTY_TEXT,
    showCheckmarks = true,
    isEqual = Object.is,
    listHeight,
    autoFocusSearch,
    style,
    styles: slots,
    theme: themeOverride,
    testID,
  } = props;
  const theme = usePickerTheme(themeOverride);
  const { query, setQuery, rows, atMax, isSelected, toggle } = useSelectList(props, filterOption, isEqual);

  const renderRow = ({ item }: { item: SelectRow<T> }) => {
    if (item.type === 'header') {
      return <GroupHeader group={item.group} renderGroupHeader={renderGroupHeader} theme={theme} slots={slots} />;
    }
    const selected = isSelected(item.option.value);
    return (
      <OptionRow
        option={item.option}
        selected={selected}
        disabled={isOptionDisabled(item.option, selected, atMax)}
        multiple={!!props.multiple}
        showCheckmarks={showCheckmarks}
        renderOption={renderOption}
        onToggle={toggle}
        theme={theme}
        slots={slots}
      />
    );
  };

  return (
    <View style={[style, slots?.container]} testID={testID}>
      {props.query === undefined && shouldShowSearch(searchable, options.length) && (
        <View style={[{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.sm }, slots?.search]}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            autoFocus={autoFocusSearch}
            theme={theme}
            style={slots?.searchInput}
          />
        </View>
      )}
      <FlatList
        data={rows}
        keyExtractor={getRowKey}
        showsVerticalScrollIndicator={SHOWS_SCROLL_INDICATOR}
        renderItem={renderRow}
        keyboardShouldPersistTaps="handled"
        style={[listHeight !== undefined ? { height: listHeight } : null, slots?.list]}
        ListEmptyComponent={
          <View style={[styles.empty, { padding: theme.spacing.xl }, slots?.empty]}>
            <Text style={[textStyle(theme, 'md'), { color: theme.colors.textSecondary }, slots?.emptyText]}>{emptyText}</Text>
          </View>
        }
      />
    </View>
  );
};
