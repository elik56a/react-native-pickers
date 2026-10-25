interface LabeledItem {
  label: string;
  disabled?: boolean;
}

export const matchLabel = (items: ReadonlyArray<LabeledItem>, query: string, numeric: boolean) => {
  const enabled = items.flatMap((it, i) => (it.disabled ? [] : [i]));
  // "5" should find "05" on padded numeric wheels
  const exact = numeric ? enabled.find((i) => Number(items[i]?.label) === Number(query)) : undefined;
  return exact ?? enabled.find((i) => items[i]?.label.toLowerCase().startsWith(query)) ?? -1;
};

export const canExtend = (items: ReadonlyArray<LabeledItem>, query: string) => {
  return items.some((it) => !it.disabled && it.label.length > query.length && it.label.toLowerCase().startsWith(query));
};
