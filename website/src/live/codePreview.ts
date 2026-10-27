/** The default export's last statement: `return (\n…\n  );` or `return <… />;`, closing the file. */
const MULTILINE_RETURN = /^return \(\n([\s\S]*)\n[ \t]*\);\n\}\s*$/;
const MULTILINE_START = 'return (\n';
const INLINE_RETURN = /\breturn (<.*>);\n\}\s*$/;
const INLINE_START = 'return ';

interface CodePreview {
  /** The JSX, dedented */
  text: string;
  start: number;
  end: number;
  /** Stripped from every line, and put back on edit */
  indent: string;
}

const findPreview = (code: string): CodePreview | null => {
  const at = code.lastIndexOf(MULTILINE_START);
  const body = at === -1 ? undefined : MULTILINE_RETURN.exec(code.slice(at))?.[1];
  if (body) {
    const lines = body.split('\n');
    const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => /^ */.exec(line)?.[0].length ?? 0));
    const start = at + MULTILINE_START.length;
    return {
      text: lines.map((line) => line.slice(indent)).join('\n'),
      start,
      end: start + body.length,
      indent: ' '.repeat(indent),
    };
  }
  const inline = INLINE_RETURN.exec(code);
  if (!inline) return null;
  const start = inline.index + INLINE_START.length;
  return {
    text: inline[1],
    start,
    end: start + inline[1].length,
    indent: '',
  };
};

/** The JSX an example renders, shown while its code is collapsed; `null` when the example doesn't end in one return. */
export const toCodePreview = (code: string): string | null => findPreview(code)?.text ?? null;

/** Puts an edited preview back into the full code, at the indentation it was taken from. */
export const withCodePreview = (code: string, text: string) => {
  const preview = findPreview(code);
  if (!preview) return code;
  const body = text
    .split('\n')
    .map((line) => (line ? preview.indent + line : line))
    .join('\n');
  return code.slice(0, preview.start) + body + code.slice(preview.end);
};
