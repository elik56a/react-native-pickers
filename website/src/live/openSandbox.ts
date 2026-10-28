import { toSnackUrl, toStackBlitzFields, toStackBlitzUrl } from './sandbox';

const openInSnack = (code: string) => window.open(toSnackUrl(code), '_blank', 'noopener');

/** StackBlitz takes a form POST, so the project opens without an API key or a size limit on the URL. */
const openInStackBlitz = (code: string) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = toStackBlitzUrl(code);
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

export const SANDBOXES = [
  { label: 'Expo Snack', open: openInSnack },
  { label: 'StackBlitz', open: openInStackBlitz },
];
