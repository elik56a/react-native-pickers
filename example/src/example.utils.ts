import { COMPONENTS_LABEL, SHOWCASE_LABEL } from './example.constants';
import type { CatalogEntryInfo, Route } from './example.types';

/** Both sections open, and only the group of the page shown, as the docs sidebar opens the one you're in. */
export const initialOpenSections = (route: Route, pages: readonly CatalogEntryInfo[]) => {
  const group = route.page && pages.find(({ page }) => page.doc === route.page.doc)?.group;
  return group ? [COMPONENTS_LABEL, SHOWCASE_LABEL, group] : [COMPONENTS_LABEL, SHOWCASE_LABEL];
};
