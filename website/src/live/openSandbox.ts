import { CODEPEN_URL } from './live.constants';
import { toCodePenFields, toSnackUrl, toStackBlitzFields, toStackBlitzUrl } from './sandbox';

const openInSnack = (code: string) => window.open(toSnackUrl(code), '_blank', 'noopener');

/** StackBlitz and CodePen take a form POST, so the project opens without an API key or a size limit on the URL. */
const postForm = (action: string, fields: Record<string, string>) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  form.target = '_blank';
  for (const [name, value] of Object.entries(fields)) {
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

export const SANDBOXES = [
  { label: 'Expo Snack', open: openInSnack },
  { label: 'StackBlitz', open: (code: string) => postForm(toStackBlitzUrl(code), toStackBlitzFields(code)) },
  { label: 'CodePen', open: (code: string) => postForm(CODEPEN_URL, toCodePenFields(code)) },
];
