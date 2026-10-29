import type { CatalogPage } from '../../website/src/catalog/catalog.types';
import type { ShowcaseItem } from '../../website/src/showcase/showcase.types';

/** What the page shows: a component page with its playgrounds, or a showcase screen. */
export type Route = { page: CatalogPage; showcase?: never } | { showcase: ShowcaseItem; page?: never };

export interface Insets {
  top: number;
  bottom: number;
}

/** A catalog page as the drawer lists it: its group, how deep it sits, and whether it opens its group. */
export interface CatalogEntryInfo {
  page: CatalogPage;
  group?: string;
  depth: number;
  startsGroup: boolean;
}
