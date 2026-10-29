import { Platform } from 'react-native';

import { DESIGN } from '@elik56a/react-native-pickers';
import { CATALOG } from '../../website/src/catalog/catalog.constants';
import { flattenCatalog } from '../../website/src/catalog/catalog.utils';
import { PLATFORM } from '../../website/src/home/device/device.constants';
import type { Platform as DevicePlatform } from '../../website/src/home/device/device.types';
import type { CatalogEntryInfo } from './example.types';

/** From this width the drawer stays open beside the page, as the docs sidebar does. */
export const WIDE_WIDTH = 900;
export const DRAWER_WIDTH = 280;
/** On wide screens a picker keeps a phone-like width beside its props, as in the docs playgrounds. */
export const PREVIEW_MAX_WIDTH = 440;
export const PROPS_WIDTH = 320;

export const DESIGN_OPTIONS = [
  { label: 'Auto', value: DESIGN.auto },
  { label: 'iOS', value: DESIGN.ios },
  { label: 'Material', value: DESIGN.material },
  { label: 'Web', value: DESIGN.web },
];

/** The showcase screens take the docs' device platforms; Windows and macOS run as Android does. */
export const DEVICE_PLATFORM: DevicePlatform =
  Platform.OS === PLATFORM.ios ? PLATFORM.ios : Platform.OS === PLATFORM.web ? PLATFORM.web : PLATFORM.android;

export const MENU_ICON = '☰';
export const SHOWCASE_LABEL = 'Showcase';
export const COMPONENTS_LABEL = 'Components';
/** The drawn chevron turns from pointing right (folded) to down (open). */
export const CARET_ROTATION = { inputRange: [0, 1], outputRange: ['-45deg', '45deg'] };

/** Indent per level in the drawer: a group's pages, then pages nested under one. */
export const DRAWER_INDENT = 14;
export const DRAWER_ITEM_PADDING = 12;

/** The catalog's pages, each marked when it is the first of its group, where the drawer puts the group's name. */
export const CATALOG_PAGES: CatalogEntryInfo[] = flattenCatalog(CATALOG).map((entry, i, all) => ({
  ...entry,
  startsGroup: !!entry.group && entry.group !== all[i - 1]?.group,
}));
