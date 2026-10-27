import {
  PACKAGE,
  SANDBOX_APP,
  SANDBOX_TITLE,
  SNACK_URL,
  WEB_DEPENDENCIES,
  WEB_DEV_DEPENDENCIES,
  WEB_TEMPLATE_FILES,
} from './live.constants';
import type { ProjectFiles } from './live.types';

/** Only a whole file (imports + a default export) runs outside the docs; bare snippets lean on the docs' scope. */
export const canOpenInSandbox = (code: string) => /export\s+default\s+function/.test(code);

export const toSnackUrl = (code: string) => {
  const params = {
    name: SANDBOX_TITLE,
    platform: 'web',
    dependencies: PACKAGE,
    files: JSON.stringify({
      'App.tsx': { type: 'CODE', contents: SANDBOX_APP },
      'Example.tsx': { type: 'CODE', contents: code },
    }),
  };
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return `${SNACK_URL}?${query}`;
};

/** A Vite + react-native-web project running the example as `src/Example.tsx`. */
export const toWebProject = (code: string): ProjectFiles => ({
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
  'src/Example.tsx': code,
});

/** The form fields StackBlitz's POST API takes. */
export const toStackBlitzFields = (code: string): Record<string, string> => ({
  'project[title]': SANDBOX_TITLE,
  'project[template]': 'node',
  ...Object.fromEntries(Object.entries(toWebProject(code)).map(([path, content]) => [`project[files][${path}]`, content])),
});

export const toCodeSandboxBody = (code: string) => ({
  files: Object.fromEntries(Object.entries(toWebProject(code)).map(([path, content]) => [path, { content }])),
});
