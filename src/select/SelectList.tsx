import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { textStyle, usePickerTheme } from '../theme';
import type { PickerTheme } from '../theme';
import type { SlotStyles, ThemableProps } from '../types';
import { defaultFilter } from './filter';

export { defaultFilter };

export interface SelectOption<T> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
  /** Leading element: icon, avatar, flag... */
  icon?: React.ReactNode;
  /** Options sharing a group are rendered under a section header */
  group?: string;
  /** Extra search terms */
  keywords?: string[];
}

export type SelectSlot =
  | 'container'
  | 'search'
  | 'searchInput'
  | 'list'
  | 'groupHeader'
  | 'groupHeaderText'
  | 'option'
  | 'selectedOption'
  | 'optionLabel'
  | 'selectedOptionLabel'
  | 'optionDescription'
  | 'check'
  | 'empty'
  | 'emptyText';

export interface SelectRenderOptionInfo<T> {
  option: SelectOption<T>;
  selected: boolean;
  disabled: boolean;
  theme: PickerTheme;
}

/** Blocks inference from `onChange`, so `onChange={setState}` doesn't infer `T` as `SetStateAction<…>`. Works before TS 5.4's built-in NoInfer. */
type NoInferValue<T> = [T][T extends unknown ? 0 : never];

export type SelectValueProps<T> =
  | { multiple?: false; value?: T | null; onChange?: (value: NoInferValue<T>, option: SelectOption<T>) => void }
  | { multiple: true; value?: T[]; onChange?: (value: NoInferValue<T>[], options: SelectOption<T>[]) => void; maxSelected?: number };

export type SelectListBaseProps<T> = ThemableProps & {
  options: ReadonlyArray<SelectOption<T>>;
  /** Show a search field. Default: true when there are more than 8 options */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Custom filter. Default: case/diacritics-insensitive match on label, description and keywords */
  filterOption?: (option: SelectOption<T>, query: string) => boolean;
  renderOption?: (info: SelectRenderOptionInfo<T>) => React.ReactNode;
  renderGroupHeader?: (group: string, theme: PickerTheme) => React.ReactNode;
  emptyText?: string;
  /** Show check marks on selected rows. Default: true */
  showCheckmarks?: boolean;
  isEqual?: (a: T, b: T) => boolean;
  /** Height of the list area. Default: grows with content */
  listHeight?: number;
  autoFocusSearch?: boolean;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<SelectSlot>;
  testID?: string;
};

export type SelectListProps<T> = SelectListBaseProps<T> & SelectValueProps<T>;

type Row<T> = { type: 'header'; group: string } | { type: 'option'; option: SelectOption<T> };

export function SelectList<T>(props: SelectListProps<T>) {
  const {
    options,
    searchable,
    searchPlaceholder = 'Search',
    filterOption = defaultFilter,
    renderOption,
    renderGroupHeader,
    emptyText = 'No results',
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
  const c = theme.colors;
  const [query, setQuery] = useState('');
  const showSearch = searchable ?? options.length > 8;

  const selectedValues: T[] = props.multiple ? props.value ?? [] : props.value !== undefined && props.value !== null ? [props.value] : [];
  const isSelected = useCallback((v: T) => selectedValues.some((s) => isEqual(s, v)), [isEqual, selectedValues]);

  const rows = useMemo<Row<T>[]>(() => {
    const filtered = query ? options.filter((o) => filterOption(o, query)) : options;
    const out: Row<T>[] = [];
    const order: string[] = [];
    const byGroup = new Map<string, SelectOption<T>[]>();
    for (const o of filtered) {
      const g = o.group ?? '';
      if (!byGroup.has(g)) {
        byGroup.set(g, []);
        order.push(g);
      }
      byGroup.get(g)!.push(o);
    }
    for (const g of order) {
      if (g) out.push({ type: 'header', group: g });
      for (const o of byGroup.get(g)!) out.push({ type: 'option', option: o });
    }
    return out;
  }, [filterOption, options, query]);

  const toggle = useCallback(
    (o: SelectOption<T>) => {
      if (!props.multiple) {
        props.onChange?.(o.value, o);
        return;
      }
      const cur = props.value ?? [];
      const has = cur.some((v) => isEqual(v, o.value));
      if (!has && props.maxSelected !== undefined && cur.length >= props.maxSelected) return;
      const next = has ? cur.filter((v) => !isEqual(v, o.value)) : [...cur, o.value];
      props.onChange?.(
        next,
        next.map((v) => options.find((x) => isEqual(x.value, v))!).filter(Boolean)
      );
    },
    [isEqual, options, props]
  );

  const atMax = props.multiple && props.maxSelected !== undefined && (props.value?.length ?? 0) >= props.maxSelected;

  const renderRow = ({ item }: { item: Row<T> }) => {
    if (item.type === 'header') {
      return renderGroupHeader ? (
        <>{renderGroupHeader(item.group, theme)}</>
      ) : (
        <View style={[{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xs }, slots?.groupHeader]}>
          <Text style={[textStyle(theme, 'xs', 'bold'), { color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6 }, slots?.groupHeaderText]}>
            {item.group}
          </Text>
        </View>
      );
    }
    const o = item.option;
    const selected = isSelected(o.value);
    const disabled = !!o.disabled || (!!atMax && !selected);
    return (
      <Pressable
        onPress={disabled ? undefined : () => toggle(o)}
        accessibilityRole={props.multiple ? 'checkbox' : 'button'}
        accessibilityState={{ selected, checked: props.multiple ? selected : undefined, disabled }}
        accessibilityLabel={o.label}
        style={({ pressed }) => [
          s.option,
          {
            paddingHorizontal: theme.spacing.lg,
            marginHorizontal: theme.spacing.sm,
            borderRadius: theme.radius.md,
            backgroundColor: selected ? c.primaryMuted : pressed ? c.surface : 'transparent',
            opacity: disabled ? 0.45 : 1,
          },
          slots?.option,
          selected && slots?.selectedOption,
        ]}
      >
        {renderOption ? (
          renderOption({ option: o, selected, disabled, theme })
        ) : (
          <>
            {o.icon ? <View style={{ marginEnd: theme.spacing.md }}>{o.icon}</View> : null}
            <View style={s.flex}>
              <Text
                numberOfLines={1}
                style={[textStyle(theme, 'md', selected ? 'medium' : 'regular'), slots?.optionLabel, selected && slots?.selectedOptionLabel]}
              >
                {o.label}
              </Text>
              {o.description ? (
                <Text numberOfLines={2} style={[textStyle(theme, 'sm'), { color: c.textSecondary, marginTop: 2 }, slots?.optionDescription]}>
                  {o.description}
                </Text>
              ) : null}
            </View>
            {showCheckmarks && (props.multiple || selected) ? (
              <Check selected={selected} multiple={!!props.multiple} theme={theme} style={slots?.check} />
            ) : null}
          </>
        )}
      </Pressable>
    );
  };

  return (
    <View style={[style, slots?.container]} testID={testID}>
      {showSearch && (
        <View style={[{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.sm }, slots?.search]}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor={c.textSecondary}
            autoFocus={autoFocusSearch}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            accessibilityLabel={searchPlaceholder}
            style={[
              textStyle(theme, 'md'),
              { backgroundColor: c.surface, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, height: 42 },
              slots?.searchInput,
            ]}
          />
        </View>
      )}
      <FlatList
        data={rows}
        keyExtractor={(r, i) => (r.type === 'header' ? `h:${r.group}` : `o:${i}:${r.option.label}`)}
        renderItem={renderRow}
        keyboardShouldPersistTaps="handled"
        style={[listHeight !== undefined ? { height: listHeight } : null, slots?.list]}
        ListEmptyComponent={
          <View style={[{ padding: theme.spacing.xl, alignItems: 'center' }, slots?.empty]}>
            <Text style={[textStyle(theme, 'md'), { color: c.textSecondary }, slots?.emptyText]}>{emptyText}</Text>
          </View>
        }
      />
    </View>
  );
}

function Check({ selected, multiple, theme, style }: { selected: boolean; multiple: boolean; theme: PickerTheme; style?: StyleProp<any> }) {
  const c = theme.colors;
  if (!multiple) {
    return <Text style={[textStyle(theme, 'md', 'bold'), { color: c.primary, marginStart: theme.spacing.md }, style]}>✓</Text>;
  }
  return (
    <View
      style={[
        s.box,
        { marginStart: theme.spacing.md, borderRadius: 6, borderColor: selected ? c.primary : c.border, backgroundColor: selected ? c.primary : 'transparent' },
        style,
      ]}
    >
      {selected ? <Text style={{ color: c.onPrimary, fontSize: 13, fontWeight: '700', lineHeight: 16 }}>✓</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingVertical: 10, marginVertical: 1 },
  flex: { flex: 1 },
  box: { width: 22, height: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
