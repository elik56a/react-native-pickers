import fs from 'node:fs';
import path from 'node:path';
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const PACKAGE = '@elik56a/react-native-pickers';
const REPO = 'https://github.com/elik56a/react-native-pickers';
const SITE = 'https://elik56a.github.io/react-native-pickers/';
const DESCRIPTION =
  'Wheel, time, date, calendar, range, select and emoji pickers for React Native. 100% JavaScript, zero native code — Expo Go, bare RN and React Native Web.';
const local = (pkg: string) => path.dirname(require.resolve(`${pkg}/package.json`));
const { version } = require('../package.json');

// Written by scripts/prepare.mts from the git tags, newest first. The line npm currently serves gets its exact version.
// Only the latest release is indexed by search engines; Next and older lines would compete with it as duplicates.
const releasedLines: string[] = fs.existsSync(path.join(__dirname, 'versions.json')) ? require('./versions.json') : [];
const versionOptions = Object.fromEntries(
  releasedLines.map((line, i) => [line, { label: version.startsWith(`${line}.`) ? `v${version}` : `v${line}.x`, noIndex: i > 0 }])
);

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: 'React Native Pickers', url: SITE },
    {
      '@type': 'SoftwareSourceCode',
      name: 'React Native Pickers',
      alternateName: PACKAGE,
      description: DESCRIPTION,
      url: SITE,
      codeRepository: REPO,
      programmingLanguage: ['TypeScript', 'JavaScript'],
      runtimePlatform: ['React Native', 'Expo', 'React Native Web', 'iOS', 'Android'],
      license: 'https://opensource.org/licenses/MIT',
      version,
      author: { '@type': 'Person', name: 'Eliyahu Kriel', url: 'https://github.com/elik56a' },
      keywords:
        'react native date picker, time picker, wheel picker, calendar, date range picker, select, dropdown, emoji picker, bottom sheet, expo',
    },
  ],
};

const config: Config = {
  title: 'React Native Pickers',
  tagline: DESCRIPTION,
  favicon: 'img/logo.svg',
  url: 'https://elik56a.github.io',
  baseUrl: '/react-native-pickers/',
  organizationName: 'elik56a',
  projectName: 'react-native-pickers',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: { format: 'detect', hooks: { onBrokenMarkdownLinks: 'throw' } },
  i18n: { defaultLocale: 'en', locales: ['en'] },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'react native picker, react native date picker, react native time picker, react native wheel picker, react native calendar, date range picker, react native select, dropdown, emoji picker, bottom sheet, expo, react native web',
      },
    },
    { tagName: 'link', attributes: { rel: 'alternate', type: 'text/plain', title: 'LLM docs', href: '/react-native-pickers/llms.txt' } },
    { tagName: 'script', attributes: { type: 'application/ld+json' }, innerHTML: JSON.stringify(structuredData) },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: `${REPO}/edit/master/website/`,
          editCurrentVersion: true,
          versions: { current: { label: 'Next 🚧', noIndex: releasedLines.length > 0 }, ...versionOptions },
          showLastUpdateTime: true,
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
        sitemap: { changefreq: 'weekly', lastmod: 'date' },
      } satisfies Preset.Options,
    ],
  ],

  clientModules: [require.resolve('./src/clientModules/searchEventCompat.ts')],

  themes: [
    '@docusaurus/theme-live-codeblock',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: 'docs',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        // Only index the latest release; Next and older lines would duplicate every result.
        ignoreFiles: [/^docs\/(next|\d+\.\d+)\//],
      },
    ],
  ],

  plugins: [
    (_context, _options) => ({
      name: 'react-native-web',
      configureWebpack(_config, _isServer, utils) {
        return {
          resolve: {
            alias: {
              react: local('react'),
              'react-dom': local('react-dom'),
              'react-native$': local('react-native-web'),
              [`${PACKAGE}$`]: path.resolve(__dirname, '../src/index.ts'),
            },
          },
          plugins: [new utils.currentBundler.instance.DefinePlugin({ __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production') })],
        };
      },
    }),
    [
      'docusaurus-plugin-llms',
      {
        title: 'React Native Pickers',
        description: `${PACKAGE}: pure-JS wheel, time, date (calendar, range, multiple, wheel), select and emoji pickers plus bottom sheets for React Native, Expo and React Native Web.`,
        excludeImports: true,
        removeDuplicateHeadings: true,
        generateMarkdownFiles: true,
        includeOrder: [
          'intro.mdx',
          'resources/ai.mdx',
          'getting-started/installation.mdx',
          'getting-started/quick-start.mdx',
          'getting-started/**',
          'components/**',
          'api/**',
          'guides/**',
          'recipes/**',
          'resources/**',
        ],
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
    metadata: [
      {
        name: 'description',
        content: 'Pure-JS pickers for React Native: wheel, time, date, calendar, range, select, emoji, bottom sheets.',
      },
    ],
    announcementBar: {
      id: 'llms',
      content: `Using an AI assistant? Point it at <a href="/react-native-pickers/llms-full.txt">llms-full.txt</a> — the whole API in one file.`,
      isCloseable: true,
    },
    navbar: {
      title: 'RN Pickers',
      logo: { alt: 'React Native Pickers', src: 'img/logo.svg' },
      hideOnScroll: true,
      items: [
        { type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs' },
        { to: '/docs/components/wheel-picker', label: 'Components', position: 'left' },
        { to: '/docs/api/reference', label: 'API', position: 'left' },
        { to: '/docs/recipes/booking-range', label: 'Recipes', position: 'left' },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownItemsAfter: [
            { to: '/changelog', label: 'Changelog' },
            { href: `${REPO}/releases`, label: 'GitHub releases' },
          ],
        },
        { href: `https://www.npmjs.com/package/${PACKAGE}`, label: 'npm', position: 'right' },
        { href: REPO, label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting started', to: '/docs/getting-started/installation' },
            { label: 'Components', to: '/docs/components/wheel-picker' },
            { label: 'Theming', to: '/docs/guides/theming' },
            { label: 'API reference', to: '/docs/api/reference' },
          ],
        },
        {
          title: 'For AI assistants',
          items: [
            { label: 'llms.txt', to: 'pathname:///llms.txt' },
            { label: 'llms-full.txt', to: 'pathname:///llms-full.txt' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Changelog', to: '/changelog' },
            { label: 'GitHub', href: REPO },
            { label: 'npm', href: `https://www.npmjs.com/package/${PACKAGE}` },
            { label: 'Issues', href: `${REPO}/issues` },
          ],
        },
      ],
      copyright: `MIT © ${new Date().getFullYear()} Eliyahu Kriel`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json', 'diff'],
    },
    liveCodeBlock: { playgroundPosition: 'top' },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
  } satisfies Preset.ThemeConfig,
};

export default config;
