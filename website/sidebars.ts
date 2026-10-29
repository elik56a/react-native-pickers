import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

import { CATALOG } from './src/catalog/catalog.constants';
import type { CatalogEntry, CatalogPage } from './src/catalog/catalog.types';

type SidebarItemConfig = Extract<SidebarsConfig[string], unknown[]>[number];

const toSidebarPage = (page: CatalogPage): SidebarItemConfig =>
  page.pages
    ? {
        type: 'category',
        label: page.label,
        link: { type: 'doc', id: page.doc },
        items: page.pages.map(toSidebarPage),
      }
    : {
        type: 'doc',
        id: page.doc,
        label: page.label,
      };

/** The component pages come from the catalog, which the example app's drawer shows too. */
const toSidebarItems = (catalog: readonly CatalogEntry[]): SidebarItemConfig[] =>
  catalog.map((entry) =>
    'doc' in entry
      ? toSidebarPage(entry)
      : {
          type: 'category',
          label: entry.label,
          items: entry.pages.map(toSidebarPage),
        }
  );

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['getting-started/installation', 'getting-started/quick-start', 'getting-started/core-concepts'],
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: toSidebarItems(CATALOG),
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/designs',
        'guides/theming',
        'guides/styling',
        'guides/render-props',
        'guides/i18n-rtl',
        'guides/accessibility',
        'guides/haptics',
        'guides/forms',
        'guides/platforms',
        'guides/performance',
        'guides/typescript',
      ],
    },
    {
      type: 'category',
      label: 'API reference',
      items: ['api/reference', 'api/theme', 'api/date-utils', 'api/emoji-utils'],
    },
    {
      type: 'category',
      label: 'Recipes',
      items: [
        'recipes/booking-range',
        'recipes/birthday',
        'recipes/alarm-time',
        'recipes/duration',
        'recipes/country-select',
        'recipes/server-search',
        'recipes/flight-search-form',
        'recipes/tags',
        'recipes/chat-emoji',
        'recipes/filters-sheet',
        'recipes/category-chips',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'resources/comparison',
        {
          type: 'category',
          label: 'Migration',
          link: { type: 'doc', id: 'resources/migration/index' },
          items: [
            'resources/migration/datetimepicker',
            'resources/migration/react-native-date-picker',
            'resources/migration/modal-datetime-picker',
            'resources/migration/react-native-calendars',
            'resources/migration/ui-datepicker',
            'resources/migration/picker-select',
            'resources/migration/dropdown-picker',
            'resources/migration/element-dropdown',
            'resources/migration/picker',
            'resources/migration/segmented-control',
            'resources/migration/country-picker-modal',
            'resources/migration/phone-number-input',
            'resources/migration/emoji-keyboard',
            'resources/migration/slider',
            'resources/migration/multi-slider',
            'resources/migration/otp-entry',
            'resources/migration/ratings',
            'resources/migration/star-rating-widget',
            'resources/migration/confirmation-code-field',
            'resources/migration/gorhom-bottom-sheet',
            'resources/migration/react-native-modal',
            'resources/migration/actions-sheet',
            'resources/migration/expo-action-sheet',
            'resources/migration/react-native-menu',
            'resources/migration/zeego',
            'resources/migration/popup-menu',
          ],
        },
        'resources/faq',
        'resources/troubleshooting',
        'resources/ai',
        'resources/contributing',
      ],
    },
  ],
};

export default sidebars;
