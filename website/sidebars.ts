import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

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
      // Grouped by what the user picks, not how: a date picker is a calendar or wheels, a time picker wheels, a dial or a list.
      items: [
        {
          type: 'category',
          label: 'Date & time',
          items: [
            // Ranges are a mode of DatePicker, so their page sits under it; it stays a page of its own for search.
            {
              type: 'category',
              label: 'DatePicker',
              link: { type: 'doc', id: 'components/date-picker' },
              items: ['components/date-range-picker'],
            },
            'components/date-wheel-picker',
            'components/time-picker',
            'components/duration-picker',
            'components/date-time-picker',
          ],
        },
        {
          type: 'category',
          label: 'Select',
          items: ['components/select-picker', 'components/select-list', 'components/country-picker', 'components/horizontal-list'],
        },
        {
          type: 'category',
          label: 'Wheels',
          items: ['components/wheel-picker', 'components/multi-wheel-picker'],
        },
        'components/emoji-picker',
        {
          type: 'category',
          label: 'Fields & sheets',
          items: ['components/picker-fields', 'components/picker-sheets', 'components/bottom-sheet'],
        },
      ],
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
        'resources/migration',
        'resources/faq',
        'resources/troubleshooting',
        'resources/ai',
        'resources/contributing',
      ],
    },
  ],
};

export default sidebars;
