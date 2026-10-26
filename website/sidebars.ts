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
      items: [
        'components/wheel-picker',
        'components/multi-wheel-picker',
        'components/time-picker',
        'components/date-picker',
        'components/date-range-picker',
        'components/date-wheel-picker',
        'components/date-time-picker',
        'components/select-picker',
        'components/select-list',
        'components/emoji-picker',
        'components/bottom-sheet',
        'components/picker-sheets',
        'components/picker-fields',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
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
        'recipes/tags',
        'recipes/chat-emoji',
        'recipes/filters-sheet',
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
