import { FlatList } from 'react-native';

import { OptionRow } from '../../select/components/OptionRow';
import { SELECT_DESIGN } from '../../select/select.constants';
import { useTimeList } from '../hooks/useTimeList';
import { DEFAULT_LIST_VISIBLE_ROWS, LIST_ROW_MARGIN } from '../time.constants';
import { styles } from '../time.styles';
import type { TimeListProps } from '../time.types';

/** Times of the day in a scrolling list, opened at the chosen one, with the select list's rows. */
export const TimeList = ({ date, onChange, options, visibleRows = DEFAULT_LIST_VISIBLE_ROWS, theme, style, testID }: TimeListProps) => {
  const list = useTimeList(date, onChange, options, visibleRows);
  const rowHeight = SELECT_DESIGN[theme.design].rowHeight;
  const length = rowHeight + LIST_ROW_MARGIN;

  return (
    <FlatList
      data={list.items}
      keyExtractor={(item) => String(item.value)}
      getItemLayout={(_, index) => ({
        length,
        offset: length * index,
        index,
      })}
      initialScrollIndex={list.initialIndex}
      keyboardShouldPersistTaps="handled"
      style={[{ height: length * visibleRows }, style]}
      testID={testID}
      renderItem={({ item }) => (
        <OptionRow
          option={item}
          selected={item.value === list.selected}
          disabled={false}
          multiple={false}
          showCheckmarks
          onToggle={list.select}
          theme={theme}
          slots={{ option: [styles.listRow, { height: rowHeight }] }}
        />
      )}
    />
  );
};
