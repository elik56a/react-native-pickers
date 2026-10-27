import { LIVE_CONTROLS } from './live.constants';
import type { JsxTag, LiveControl, LiveOption } from './live.types';

/** Past the `>` closing the tag that starts at `from`; braces and strings are skipped, so `onClear={() => …}` doesn't end it. */
const findTagEnd = (code: string, from: number) => {
  let depth = 0;
  let quote: string | null = null;
  for (let i = from; i < code.length; i++) {
    const char = code[i];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || (depth > 0 && (char === "'" || char === '`'))) {
      quote = char;
    } else if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
    } else if (char === '>' && depth === 0) {
      return i + 1;
    }
  }
  return -1;
};

/** Every opening tag of `components` in the code. */
const findTags = (code: string, components: readonly string[]): JsxTag[] =>
  // Array.from, not a spread: the site's Babel build spreads iterators loosely, into a one-item array.
  Array.from(code.matchAll(new RegExp(`<(?:${components.join('|')})(?=[\\s/>])`, 'g')))
    .map((match) => {
      const attributes = match.index + match[0].length;
      return {
        attributes,
        end: findTagEnd(code, attributes),
      };
    })
    .filter((tag) => tag.end !== -1);

/** `prop="x"`, `prop={true}`, `prop={false}`, or bare `prop`. */
const attribute = (prop: string) => new RegExp(`\\s${prop}(?:=("[^"]*"|\\{(?:true|false)\\}))?(?=[\\s/>])`);

const toOption = (raw: string | undefined): LiveOption => {
  if (raw === undefined) return true;
  return raw.startsWith('"') ? raw.slice(1, -1) : raw === '{true}';
};

const toSource = (prop: string, option: LiveOption) => {
  if (option === true) return prop;
  return option === false ? `${prop}={false}` : `${prop}="${option}"`;
};

/** The props the side panel offers for this code: one control per prop, for the components the code renders. */
export const findControls = (code: string): LiveControl[] => {
  const byProp = new Map<string, LiveControl>();
  for (const control of LIVE_CONTROLS) {
    if (control.requires && !control.requires.test(code)) continue;
    const components = control.components.filter((name) => findTags(code, [name]).length > 0);
    if (components.length === 0) continue;
    const known = byProp.get(control.prop);
    byProp.set(control.prop, known ? { ...known, components: [...known.components, ...components] } : { ...control, components });
  }
  return Array.from(byProp.values());
};

/** The prop's value on the first tag that sets it, else the components' default. */
export const readControl = (code: string, control: LiveControl): LiveOption => {
  for (const tag of findTags(code, control.components)) {
    const match = attribute(control.prop).exec(code.slice(tag.attributes, tag.end));
    if (match) return toOption(match[1]);
  }
  return control.default;
};

/** Sets the prop on every tag of the control's components, adding it where the code didn't set it. */
export const writeControl = (code: string, control: LiveControl, option: LiveOption) => {
  const source = toSource(control.prop, option);
  // Last tag first, so earlier positions stay valid.
  return findTags(code, control.components)
    .reverse()
    .reduce((next, tag) => {
      const region = next.slice(tag.attributes, tag.end);
      const match = attribute(control.prop).exec(region);
      if (match) {
        const at = tag.attributes + match.index + 1;
        return next.slice(0, at) + source + next.slice(at + match[0].length - 1);
      }
      // One prop per line: add it as the first line, at the others' indentation.
      const indent = /^\n[ \t]*/.exec(region)?.[0];
      return next.slice(0, tag.attributes) + (indent ? indent + source : ` ${source}`) + next.slice(tag.attributes);
    }, code);
};
