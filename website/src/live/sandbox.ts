import {
  COMPONENT_FOLDERS,
  GENERIC_EXAMPLE_NAMES,
  PACKAGE,
  SANDBOX_TITLE,
  SNACK_URL,
  SOURCE_URL,
  STACKBLITZ_URL,
  toSandboxApp,
  WEB_DEPENDENCIES,
  WEB_DEV_DEPENDENCIES,
  WEB_TEMPLATE_FILES,
} from './live.constants';
import type { ProjectFiles } from './live.types';

/** Only a whole file (imports + a default export) runs outside the docs; bare snippets lean on the docs' scope. */
export const canOpenInSandbox = (code: string) => /export\s+default\s+function/.test(code);

/** The first of the library's components the code renders, e.g. `DatePickerField`. */
export const findMainComponent = (code: string) =>
  Array.from(code.matchAll(/<([A-Z]\w*)(?=[\s/>])/g), (match) => match[1]).find((name) => name in COMPONENT_FOLDERS);

/** The main component's source on GitHub. */
export const toSourceUrl = (code: string) => {
  const component = findMainComponent(code);
  return component ? `${SOURCE_URL}${COMPONENT_FOLDERS[component]}/${component}.tsx` : undefined;
};

/** The example's file and component name in a sandbox: its own, unless generic, then its main component's, e.g. `DatePickerExample`. */
export const toExampleName = (code: string) => {
  const own = /export\s+default\s+function\s+(\w+)/.exec(code)?.[1];
  if (own && !GENERIC_EXAMPLE_NAMES.includes(own)) return own;
  const component = findMainComponent(code);
  return component ? `${component}Example` : 'Example';
};

export const toSnackUrl = (code: string) => {
  const name = toExampleName(code);
  const params = {
    name: SANDBOX_TITLE,
    platform: 'web',
    dependencies: PACKAGE,
    files: JSON.stringify({
      'App.tsx': { type: 'CODE', contents: toSandboxApp(name) },
      [`${name}.tsx`]: { type: 'CODE', contents: code },
    }),
  };
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return `${SNACK_URL}?${query}`;
};

/** A Vite + react-native-web project running the example as `src/<name>.tsx`. */
export const toWebProject = (code: string): ProjectFiles => {
  const name = toExampleName(code);
  return {
    'package.json': JSON.stringify(
      {
        name: 'react-native-pickers-example',
        private: true,
        type: 'module',
        scripts: {
          dev: 'vite',
          start: 'vite',
        },
        dependencies: WEB_DEPENDENCIES,
        devDependencies: WEB_DEV_DEPENDENCIES,
      },
      null,
      2
    ),
    ...WEB_TEMPLATE_FILES,
    'src/App.tsx': toSandboxApp(name),
    [`src/${name}.tsx`]: code,
  };
};

/** StackBlitz opens on the example's file. */
export const toStackBlitzUrl = (code: string) => `${STACKBLITZ_URL}?file=src/${toExampleName(code)}.tsx`;

/** The form fields StackBlitz's POST API takes. */
export const toStackBlitzFields = (code: string): Record<string, string> => ({
  'project[title]': SANDBOX_TITLE,
  'project[template]': 'node',
  ...Object.fromEntries(Object.entries(toWebProject(code)).map(([path, content]) => [`project[files][${path}]`, content])),
});
