import fs from 'node:fs';
import path from 'node:path';
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

import { CODE_THEME } from './src/theme/Playground/playground.constants';

const PACKAGE = '@elik56a/react-native-pickers';
const REPO = 'https://github.com/elik56a/react-native-pickers';
const SITE = 'https://elik56a.github.io/react-native-pickers/';
const BASE_URL = '/react-native-pickers/';
const AUTHOR = 'Eliyahu Kriel';
const LINKEDIN = 'https://www.linkedin.com/in/elikri/';
const NPM = `https://www.npmjs.com/package/${PACKAGE}`;

// Simple Icons (CC0) brand marks, fetched from Iconify.
const BRAND_ICON_PATHS = {
  GitHub:
    'M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  npm: 'M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019l-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z',
  LinkedIn:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z',
};

const socialLink = (label: keyof typeof BRAND_ICON_PATHS, href: string, title: string) =>
  `<a class="footer-social__link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${title}" title="${title}">` +
  `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="${BRAND_ICON_PATHS[label]}"/></svg></a>`;

const FOOTER_BRAND = `
<a class="footer-brand" href="${BASE_URL}" aria-label="React Native Pickers home">
  <img src="${BASE_URL}img/logo.svg" width="40" height="40" alt="" />
  <span>React Native Pickers</span>
</a>
<p class="footer-tagline">Every picker your React Native app needs. 100% JavaScript, zero native code.</p>
<div class="footer-social">
  ${socialLink('GitHub', REPO, 'React Native Pickers on GitHub')}
  ${socialLink('npm', NPM, 'React Native Pickers on npm')}
  ${socialLink('LinkedIn', LINKEDIN, `${AUTHOR} on LinkedIn`)}
</div>`;
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
      author: { '@type': 'Person', name: AUTHOR, url: 'https://github.com/elik56a', sameAs: [LINKEDIN] },
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
  baseUrl: BASE_URL,
  customFields: { version },
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

  clientModules: [require.resolve('./src/clientModules/searchEventCompat.ts'), require.resolve('./src/clientModules/hashScroll.ts')],

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
        { to: '/showcase', label: 'Showcase', position: 'left' },
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
          title: null,
          className: 'footer-brand-column',
          items: [{ html: FOOTER_BRAND }],
        },
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
            { label: 'npm', href: NPM },
            { label: 'Issues', href: `${REPO}/issues` },
          ],
        },
      ],
      copyright: `MIT © ${new Date().getFullYear()} <a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">${AUTHOR}</a>. Built with Docusaurus.`,
    },
    prism: {
      // One always-dark theme for every code block, the same as the live editor's.
      theme: CODE_THEME,
      darkTheme: CODE_THEME,
      additionalLanguages: ['bash', 'json', 'diff'],
    },
    liveCodeBlock: { playgroundPosition: 'top' },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
  } satisfies Preset.ThemeConfig,
};

export default config;
