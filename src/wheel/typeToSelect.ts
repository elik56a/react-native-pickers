type LabeledItem = { label: string; disabled?: boolean };

export function matchLabel(items: ReadonlyArray<LabeledItem>, query: string, numeric: boolean) {
  const enabled = items.map((_, i) => i).filter((i) => !items[i]!.disabled);
  // "5" should find "05" on padded numeric wheels
  const exact = numeric ? enabled.find((i) => Number(items[i]!.label) === Number(query)) : undefined;
  return exact ?? enabled.find((i) => items[i]!.label.toLowerCase().startsWith(query)) ?? -1;
}

export function canExtend(items: ReadonlyArray<LabeledItem>, query: string) {
  return items.some((it) => !it.disabled && it.label.length > query.length && it.label.toLowerCase().startsWith(query));
}
