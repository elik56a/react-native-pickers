import { CATALOG_PAGES, COMPONENTS_LABEL, SHOWCASE_LABEL } from './example.constants';
import { initialOpenSections } from './example.utils';

const pageAt = (doc: string) => {
  const entry = CATALOG_PAGES.find(({ page }) => page.doc === doc);
  if (!entry) throw new Error(doc);
  return entry.page;
};

describe('initialOpenSections', () => {
  it('opens the group of the page shown', () => {
    expect(initialOpenSections({ page: pageAt('components/select-list') }, CATALOG_PAGES)).toEqual([
      COMPONENTS_LABEL,
      SHOWCASE_LABEL,
      'Select',
    ]);
  });

  it('opens no group for a page outside one, or a showcase', () => {
    expect(initialOpenSections({ page: pageAt('components/color-picker') }, CATALOG_PAGES)).toEqual([COMPONENTS_LABEL, SHOWCASE_LABEL]);
  });
});
