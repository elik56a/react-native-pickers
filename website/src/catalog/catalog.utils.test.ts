import { CATALOG } from './catalog.constants';
import type { PlaygroundControl } from './catalog.types';
import {
  flattenCatalog,
  initialSelection,
  isSwitch,
  needsSelect,
  optionLabel,
  resolveValue,
  sameOption,
  selectedProps,
} from './catalog.utils';
import { PLAYGROUNDS } from './playgrounds';

const CONTROLS: PlaygroundControl[] = [
  { prop: 'display', options: ['auto', 'wheel'], unset: 'auto' },
  { prop: 'loop', options: [true, false] },
  { prop: 'firstDayOfWeek', options: [0, 1], default: null, initial: 1 },
  { prop: 'columns', options: [6, 8], default: 8 },
];

describe('initialSelection', () => {
  it('starts on initial, then default, then the first option', () => {
    expect(initialSelection(CONTROLS)).toEqual({ display: 'auto', loop: true, firstDayOfWeek: 1, columns: 8 });
  });
});

describe('selectedProps', () => {
  it('leaves out the options that leave the prop to the component', () => {
    expect(selectedProps(CONTROLS, { display: 'auto', loop: false })).toEqual({ loop: false });
    expect(selectedProps(CONTROLS, { display: 'wheel' })).toEqual({ display: 'wheel' });
  });
});

describe('resolveValue', () => {
  it('runs a value that depends on the selection', () => {
    expect(resolveValue(({ multiple }: { multiple: boolean }) => (multiple ? [] : null), { multiple: true })).toEqual([]);
    expect(resolveValue('#FFF', {})).toBe('#FFF');
  });
});

describe('options', () => {
  it('labels arrays as a list', () => {
    expect(optionLabel(['day', 'month'])).toBe('day · month');
    expect(optionLabel(false)).toBe('false');
  });

  it('compares arrays by their items', () => {
    expect(sameOption(['a'], ['a'])).toBe(true);
    expect(sameOption(1, null)).toBe(false);
  });

  it('switches two booleans and drops long option sets into a dropdown', () => {
    expect(isSwitch([false, true])).toBe(true);
    expect(isSwitch(['a', 'b'])).toBe(false);
    expect(needsSelect(['3d', 'flat'])).toBe(false);
    expect(needsSelect(['auto', 'dropdown', 'bottomSheet', 'modal'])).toBe(true);
  });
});

describe('catalog', () => {
  it('lists every page once, nested pages after their parent', () => {
    const docs = flattenCatalog(CATALOG).map(({ page }) => page.doc);
    expect(new Set(docs).size).toBe(docs.length);
    expect(docs.indexOf('components/date-range-picker')).toBe(docs.indexOf('components/date-picker') + 1);
  });

  it('keeps each page with its group and depth', () => {
    const pages = flattenCatalog(CATALOG);
    expect(pages.find(({ page }) => page.doc === 'components/date-range-picker')).toMatchObject({ group: 'Date & time', depth: 1 });
    expect(pages.find(({ page }) => page.doc === 'components/color-picker')).toMatchObject({ group: undefined, depth: 0 });
  });

  it('shows every playground on a page', () => {
    const shown = flattenCatalog(CATALOG).flatMap(({ page }) => page.playgrounds);
    expect(new Set(shown)).toEqual(new Set(Object.keys(PLAYGROUNDS)));
  });
});
