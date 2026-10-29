import type { PrismTheme } from 'prism-react-renderer';

/** Always dark, in both site themes. The colors are `--code-*` tokens in custom.css. */
export const CODE_THEME: PrismTheme = {
  plain: {
    color: 'var(--code-text)',
    backgroundColor: 'var(--site-code)',
  },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--code-comment)', fontStyle: 'italic' } },
    { types: ['punctuation', 'operator'], style: { color: 'var(--code-punctuation)' } },
    { types: ['tag', 'class-name', 'maybe-class-name'], style: { color: 'var(--code-tag)' } },
    { types: ['attr-name'], style: { color: 'var(--code-attr)' } },
    { types: ['string', 'attr-value', 'char', 'template-string'], style: { color: 'var(--code-string)' } },
    { types: ['keyword', 'module', 'control-flow'], style: { color: 'var(--code-keyword)' } },
    { types: ['function', 'method'], style: { color: 'var(--code-function)' } },
    { types: ['builtin'], style: { color: 'var(--code-type)' } },
    { types: ['number', 'boolean', 'constant'], style: { color: 'var(--code-number)' } },
    { types: ['inserted'], style: { color: 'var(--code-inserted)' } },
    { types: ['deleted'], style: { color: 'var(--code-deleted)' } },
  ],
};
