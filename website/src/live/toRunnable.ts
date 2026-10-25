const IMPORT = /^\s*import\s[\s\S]*?from\s*['"][^'"]+['"];?[ \t]*$/gm;
const DEFAULT_EXPORT = /export\s+default\s+function\s+(\w+)/;

/** Turns a copy-pasteable example file into react-live `noInline` code. */
export function toRunnable(code: string): string {
  const name = DEFAULT_EXPORT.exec(code)?.[1];
  const body = code.replace(IMPORT, '').replace(/export\s+default\s+/, '').trim();
  if (name) return `${body}\nrender(<${name} />);`;
  return /render\s*\(/.test(body) ? body : `render(${body.replace(/;$/, '')});`;
}
