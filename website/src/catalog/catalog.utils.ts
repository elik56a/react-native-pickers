import type { CatalogEntry, CatalogPage, PlaygroundControl, PlaygroundOption, PlaygroundSelection } from './catalog.types';

/** Option sets longer than this, with more than LIST_MAX_OPTIONS, or with a label longer than LABEL_MAX_CHARS (`bottomSheet`), get a dropdown instead of the horizontal list. */
const LIST_MAX_CHARS = 20;
const LIST_MAX_OPTIONS = 4;
const LABEL_MAX_CHARS = 10;

export const needsSelect = (labels: readonly string[]) =>
  labels.join('').length > LIST_MAX_CHARS || labels.length > LIST_MAX_OPTIONS || labels.some((l) => l.length > LABEL_MAX_CHARS);

export const optionLabel = (option: PlaygroundOption) => (Array.isArray(option) ? option.join(' · ') : String(option));

export const sameOption = (a: PlaygroundOption, b: PlaygroundOption | null) => JSON.stringify(a) === JSON.stringify(b);

export const isSwitch = (options: readonly PlaygroundOption[]) => options.length === 2 && options.every((o) => typeof o === 'boolean');

export const initialSelection = (controls: readonly PlaygroundControl[]): PlaygroundSelection =>
  Object.fromEntries(controls.map((c) => [c.prop, c.initial ?? c.default ?? c.options[0]]));

/** A value that depends on the selection (`mode` changes its type) is a function of it. */
export const resolveValue = (value: unknown, selection: PlaygroundSelection) => (typeof value === 'function' ? value(selection) : value);

/** The selection as props, leaving out the options that leave a prop to the component, like 'auto'. */
export const selectedProps = (controls: readonly PlaygroundControl[], selection: PlaygroundSelection) =>
  Object.fromEntries(Object.entries(selection).filter(([prop, option]) => controls.find((c) => c.prop === prop)?.unset !== option));

export const isPage = (entry: CatalogEntry): entry is CatalogPage => 'doc' in entry;

/** Every page in the catalog in sidebar order, nested ones after their parent, with its group and how deep it sits. */
export const flattenCatalog = (catalog: readonly CatalogEntry[]) =>
  catalog.flatMap((entry) => {
    const group = isPage(entry) ? undefined : entry.label;
    return (isPage(entry) ? [entry] : entry.pages).flatMap((page) => [
      {
        page,
        group,
        depth: 0,
      },
      ...(page.pages ?? []).map((child) => ({
        page: child,
        group,
        depth: 1,
      })),
    ]);
  });
