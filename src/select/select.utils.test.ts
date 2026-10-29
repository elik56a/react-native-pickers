import type { SelectOption } from './select.types';
import {
  buildRows,
  defaultFilter,
  findOptions,
  getEmptyMessage,
  getRowKey,
  getSelectedLabel,
  isAtMax,
  isOptionDisabled,
  shouldSearchInField,
  shouldShowSearch,
  toggleValue,
  toValueList,
  withSheetHeight,
} from './select.utils';

const option = (label: string, extra: Partial<SelectOption<string>> = {}): SelectOption<string> => ({
  label,
  value: label.toLowerCase(),
  ...extra,
});

describe('defaultFilter', () => {
  it('ignores case and Latin diacritics', () => {
    expect(defaultFilter(option('Crème Brûlée'), 'creme brulee')).toBe(true);
    expect(defaultFilter(option('Ice cream'), 'CREAM')).toBe(true);
  });
  it('ignores Hebrew niqqud', () => {
    expect(defaultFilter(option('שָׁלוֹם'), 'שלום')).toBe(true);
  });
  it('keeps Greek, Cyrillic and Armenian letters', () => {
    expect(defaultFilter(option('Москва'), 'моск')).toBe(true);
    expect(defaultFilter(option('Москва'), 'париж')).toBe(false);
    expect(defaultFilter(option('Αθήνα'), 'αθηνα')).toBe(true);
    expect(defaultFilter(option('Αθήνα'), 'ρώμη')).toBe(false);
    expect(defaultFilter(option('Երևան'), 'գյումրի')).toBe(false);
  });
  it('searches description and keywords', () => {
    expect(defaultFilter(option('France', { description: 'République française' }), 'republique')).toBe(true);
    expect(defaultFilter(option('Israel', { keywords: ['ישראל'] }), 'ישראל')).toBe(true);
  });
  it('requires every word to match', () => {
    expect(defaultFilter(option('New York'), 'york new')).toBe(true);
    expect(defaultFilter(option('New York'), 'new jersey')).toBe(false);
  });
});

describe('getEmptyMessage', () => {
  it('asks a searched list for a query until the user types, then says nothing matched', () => {
    expect(getEmptyMessage(true, '', 'Type to search', 'No results')).toBe('Type to search');
    expect(getEmptyMessage(true, 'lon', 'Type to search', 'No results')).toBe('No results');
    expect(getEmptyMessage(false, '', 'Type to search', 'No results')).toBe('No results');
  });
});

describe('shouldShowSearch', () => {
  it('searches long lists unless told otherwise', () => {
    expect(shouldShowSearch(undefined, 8)).toBe(false);
    expect(shouldShowSearch(undefined, 9)).toBe(true);
    expect(shouldShowSearch(false, 50)).toBe(false);
    expect(shouldShowSearch(true, 2)).toBe(true);
  });

  it('searches a remote list even before it has options', () => {
    expect(shouldShowSearch(undefined, 0, true)).toBe(true);
    expect(shouldShowSearch(false, 0, true)).toBe(false);
  });
});

describe('toValueList / findOptions', () => {
  const options = [option('A'), option('B'), option('C')];
  it('normalises single and multiple values to a list', () => {
    expect(toValueList(false, 'a')).toEqual(['a']);
    expect(toValueList(false, null)).toEqual([]);
    expect(toValueList(true, ['a', 'b'])).toEqual(['a', 'b']);
    expect(toValueList(true, undefined)).toEqual([]);
  });
  it('finds options in value order and skips unknown values', () => {
    expect(findOptions(['c', 'x', 'a'], options, Object.is).map((o) => o.label)).toEqual(['C', 'A']);
  });
});

describe('buildRows', () => {
  const options = [
    option('Israel', { group: 'Middle East' }),
    option('France', { group: 'Europe' }),
    option('Jordan', { group: 'Middle East' }),
    option('Other'),
  ];
  const labels = (rows: ReturnType<typeof buildRows<string>>) => rows.map((r) => (r.type === 'header' ? `# ${r.group}` : r.option.label));

  it('groups options under headers in order of first appearance', () => {
    expect(labels(buildRows(options, '', defaultFilter))).toEqual(['# Middle East', 'Israel', 'Jordan', '# Europe', 'France', 'Other']);
  });
  it('drops groups with no matches', () => {
    expect(labels(buildRows(options, 'fr', defaultFilter))).toEqual(['# Europe', 'France']);
  });
  it('keys headers by group and options by position', () => {
    const rows = buildRows(options, '', defaultFilter);
    expect(rows.map(getRowKey).slice(0, 2)).toEqual(['h:Middle East', 'o:1:Israel']);
  });
});

describe('toggleValue / isAtMax / isOptionDisabled', () => {
  it('adds and removes values', () => {
    expect(toggleValue(['a'], 'b', Object.is)).toEqual(['a', 'b']);
    expect(toggleValue(['a', 'b'], 'a', Object.is)).toEqual(['b']);
  });
  it('refuses to add past the maximum but still removes', () => {
    expect(toggleValue(['a', 'b'], 'c', Object.is, 2)).toBeNull();
    expect(toggleValue(['a', 'b'], 'b', Object.is, 2)).toEqual(['a']);
  });
  it('uses the custom equality', () => {
    const byId = (x: { id: number }, y: { id: number }) => x.id === y.id;
    expect(toggleValue([{ id: 1 }], { id: 1 }, byId)).toEqual([]);
  });
  it('disables unselected options at the maximum', () => {
    expect(isAtMax(2, 2)).toBe(true);
    expect(isAtMax(5)).toBe(false);
    expect(isOptionDisabled(option('A'), false, true)).toBe(true);
    expect(isOptionDisabled(option('A'), true, true)).toBe(false);
    expect(isOptionDisabled(option('A', { disabled: true }), true, false)).toBe(true);
  });
});

describe('getSelectedLabel', () => {
  it('joins labels', () => {
    expect(getSelectedLabel([option('A'), option('B')])).toBe('A, B');
  });
});

describe('shouldSearchInField', () => {
  it('types into the field only for a searchable dropdown with the built-in field', () => {
    expect(shouldSearchInField(true, undefined, false)).toBe(true);
    expect(shouldSearchInField(true, false, false)).toBe(false);
    expect(shouldSearchInField(true, undefined, true)).toBe(false);
    expect(shouldSearchInField(false, true, false)).toBe(false);
  });
});

describe('withSheetHeight', () => {
  it('opens at a fixed height unless the sheet sets its own', () => {
    expect(withSheetHeight(undefined, 0.8)?.sheetProps?.height).toBe(0.8);
    expect(withSheetHeight({ sheetProps: { height: 0.5 } }, 0.8)?.sheetProps?.height).toBe(0.5);
  });
});
