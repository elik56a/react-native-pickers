import { FlatList, View } from 'react-native';

import { PickerText } from '../core/components/PickerText';
import { SearchInput } from '../core/components/SearchInput';
import { SHOWS_SCROLL_INDICATOR } from '../core/core.constants';
import { useComponentTheme } from '../core/theme/ThemeProvider';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { CreateRow } from './components/CreateRow';
import { GroupHeader } from './components/GroupHeader';
import { LoadingState } from './components/LoadingState';
import { OptionRow } from './components/OptionRow';
import { useSelectList } from './hooks/useSelectList';
import {
  DEFAULT_CREATE_LABEL,
  DEFAULT_EMPTY_TEXT,
  DEFAULT_LOADING_TEXT,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_SEARCH_PROMPT,
  NO_OPTIONS,
  SELECT_ROW_TYPE,
} from './select.constants';
import { styles } from './select.styles';
import type { SelectListProps, SelectRow } from './select.types';
import { defaultFilter, getEmptyMessage, getRowKey, isOptionDisabled, keepAll, shouldShowSearch } from './select.utils';

export const SelectList = <T,>(props: SelectListProps<T>) => {
  const {
    options = NO_OPTIONS,
    searchable,
    searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
    filterOption = props.loadOptions || props.onSearchChange ? keepAll : defaultFilter,
    renderOption,
    renderGroupHeader,
    createLabel = DEFAULT_CREATE_LABEL,
    emptyText = DEFAULT_EMPTY_TEXT,
    searchPrompt = DEFAULT_SEARCH_PROMPT,
    loading = false,
    loadingText = DEFAULT_LOADING_TEXT,
    renderLoading,
    onEndReached,
    showCheckmarks = true,
    isEqual = Object.is,
    listHeight,
    autoFocusSearch,
    style,
    styles: slots,
    theme: themeProp,
    design,
    testID,
  } = props;
  const { theme } = useComponentTheme(themeProp, design);
  const { query, setQuery, rows, pending, atMax, isSelected, toggle, create } = useSelectList(props, filterOption, isEqual);
  const showLoader = loading || pending;
  const remote = !!(props.loadOptions || props.onSearchChange);

  const loader = <LoadingState text={loadingText} renderLoading={renderLoading} theme={theme} slots={slots} />;

  const renderRow = ({ item }: { item: SelectRow<T> }) => {
    if (item.type === SELECT_ROW_TYPE.header) {
      return <GroupHeader group={item.group} renderGroupHeader={renderGroupHeader} theme={theme} slots={slots} />;
    }
    if (item.type === SELECT_ROW_TYPE.create) {
      return <CreateRow text={item.text} label={createLabel(item.text)} onCreate={create} theme={theme} slots={slots} />;
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
    <View style={[style, slots?.container]} {...ARROW_FOCUS} testID={testID}>
      {props.query === undefined && shouldShowSearch(searchable, options.length, remote) && (
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
        onEndReached={onEndReached}
        ListFooterComponent={showLoader && rows.length > 0 ? loader : undefined}
        style={[listHeight !== undefined ? { height: listHeight } : null, slots?.list]}
        ListEmptyComponent={
          showLoader ? (
            loader
          ) : (
            <View style={[styles.empty, { padding: theme.spacing.xl }, slots?.empty]}>
              <PickerText theme={theme} color="textSecondary" style={slots?.emptyText}>
                {getEmptyMessage(remote, query, searchPrompt, emptyText)}
              </PickerText>
            </View>
          )
        }
      />
    </View>
  );
};
