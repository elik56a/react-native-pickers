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

/** `key: 'x'`, `key: true` or `key: false` in an object literal. */
const objectKey = (key: string) => new RegExp(`\\b${key}:\\s*('[^']*'|true|false)`);

const toKeySource = (key: string, option: LiveOption) => `${key}: ${typeof option === 'string' ? `'${option}'` : option}`;

/** Where the `name={{ … }}` object's body sits in `region`: between its braces. */
const findObjectBody = (region: string, name: string) => {
  const open = region.indexOf(`${name}={{`);
  if (open === -1) return null;
  const start = open + name.length + 3;
  let depth = 2;
  for (let i = start; i < region.length; i++) {
    if (region[i] === '{') depth++;
    if (region[i] === '}' && --depth === 1) {
      return {
        start,
        end: i,
      };
    }
  }
  return null;
};

/** A dotted control, such as `presetsProps.showArrows`, sets a key in the object the component takes as that prop. */
const splitProp = (prop: string) => {
  const [object, key] = prop.split('.');
  return key
    ? {
        object,
        key,
      }
    : null;
};

const readKey = (region: string, object: string, key: string) => {
  const body = findObjectBody(region, object);
  const match = body && objectKey(key).exec(region.slice(body.start, body.end));
  if (!match) return undefined;
  return match[1].startsWith("'") ? match[1].slice(1, -1) : match[1] === 'true';
};

/** Replaces the key in the object, or adds it as the object's first line; a tag without the object is left alone. */
const writeKey = (region: string, object: string, key: string, option: LiveOption) => {
  const body = findObjectBody(region, object);
  if (!body) return region;
  const content = region.slice(body.start, body.end);
  const source = toKeySource(key, option);
  const match = objectKey(key).exec(content);
  const next = match
    ? content.slice(0, match.index) + source + content.slice(match.index + match[0].length)
    : `${/^\n[ \t]*/.exec(content)?.[0] ?? ' '}${source},${content}`;
  return region.slice(0, body.start) + next + region.slice(body.end);
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
  const nested = splitProp(control.prop);
  for (const tag of findTags(code, control.components)) {
    const region = code.slice(tag.attributes, tag.end);
    if (nested) {
      const option = readKey(region, nested.object, nested.key);
      if (option !== undefined) return option;
      continue;
    }
    const match = attribute(control.prop).exec(region);
    if (match) return toOption(match[1]);
  }
  return control.default;
};

/** Sets the prop on every tag of the control's components, adding it where the code didn't set it. */
export const writeControl = (code: string, control: LiveControl, option: LiveOption) => {
  const source = toSource(control.prop, option);
  const nested = splitProp(control.prop);
  // Last tag first, so earlier positions stay valid.
  return findTags(code, control.components)
    .reverse()
    .reduce((next, tag) => {
      const region = next.slice(tag.attributes, tag.end);
      if (nested) return next.slice(0, tag.attributes) + writeKey(region, nested.object, nested.key, option) + next.slice(tag.end);
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
