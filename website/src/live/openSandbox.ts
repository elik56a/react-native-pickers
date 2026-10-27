import { CODESANDBOX_DEFINE_URL, CODESANDBOX_SANDBOX_URL, STACKBLITZ_URL } from './live.constants';
import { toCodeSandboxBody, toSnackUrl, toStackBlitzFields } from './sandbox';

const openInSnack = (code: string) => window.open(toSnackUrl(code), '_blank', 'noopener');

/** StackBlitz takes a form POST, so the project opens without an API key or a size limit on the URL. */
const openInStackBlitz = (code: string) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = STACKBLITZ_URL;
  form.target = '_blank';
  for (const [name, value] of Object.entries(toStackBlitzFields(code))) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.append(input);
  }
  document.body.append(form);
  form.submit();
  form.remove();
};

/** The tab opens during the click, before the request, so popup blockers let it through. */
const openInCodeSandbox = async (code: string) => {
  const tab = window.open('', '_blank');
  try {
    const response = await fetch(CODESANDBOX_DEFINE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(toCodeSandboxBody(code)),
    });
    const { sandbox_id: id } = await response.json();
    if (tab) tab.location.href = `${CODESANDBOX_SANDBOX_URL}${id}`;
  } catch {
    tab?.close();
  }
};

export const SANDBOXES = [
  { label: 'Expo Snack', open: openInSnack },
  { label: 'StackBlitz', open: openInStackBlitz },
  { label: 'CodeSandbox', open: openInCodeSandbox },
];
