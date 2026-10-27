import type React from 'react';

import { PACKAGE } from '../home.constants';
import { ACCENTS, DATE_STATE, TAB_COMPONENTS } from './playground.constants';
import type { Accent, AccentColors, Control, ControlValue, DemoTab, PlaygroundOptions, TabOptions } from './playground.types';

/** A JSX attribute: `name` for true, `name="x"` for strings, `name={x}` for anything else. */
export const jsxProp = (name: string, value: ControlValue) => {
  if (value === true) return name;
  return typeof value === 'string' ? `${name}="${value}"` : `${name}={${value}}`;
};

/** Props for the snippet, leaving out every value that matches the component's default. */
const SNIPPET_PROPS: { [T in DemoTab]: (o: TabOptions<T>) => (string | false)[] } = {
  date: (o) => {
    const [value, setter] = DATE_STATE[o.mode];
    return [
      'label="Dates"',
      o.mode !== 'single' && jsxProp('mode', o.mode),
      `value={${value}}`,
      `onConfirm={${setter}}`,
      'minDate={new Date()}',
      o.prices && 'markedDates={prices}',
      o.firstDayOfWeek !== 0 && jsxProp('firstDayOfWeek', o.firstDayOfWeek),
    ];
  },
  time: (o) => [
    'label="Check-in"',
    'value={checkIn}',
    'onConfirm={setCheckIn}',
    o.format !== 'auto' && jsxProp('format', o.format),
    o.minuteInterval !== 1 && jsxProp('minuteInterval', o.minuteInterval),
    o.showSeconds && 'showSeconds',
  ],
  // The guests sheet's two wheels; `loop` belongs to each column.
  wheel: (o) => [
    o.loop ? 'columns={[{ ...adults, loop: true }, { ...children, loop: true }]}' : 'columns={[adults, children]}',
    o.variant !== '3d' && jsxProp('variant', o.variant),
    o.visibleItems !== 5 && jsxProp('visibleItems', o.visibleItems),
  ],
  select: (o) => [
    'label="Where"',
    `options={${o.groups ? 'CITIES_BY_REGION' : 'CITIES'}}`,
    `value={${o.multiple ? 'cities' : 'city'}}`,
    `onChange={${o.multiple ? 'setCities' : 'setCity'}}`,
    o.multiple && 'multiple',
    // More than 8 options shows search on its own, so only turning it off needs the prop.
    !o.searchable && 'searchable={false}',
    o.loading && 'loading',
  ],
  emoji: (o) => [
    'label="Vibe"',
    'value={vibe}',
    'onSelect={setVibe}',
    o.columns !== 8 && jsxProp('columns', o.columns),
    !o.showSkinTones && 'showSkinTones={false}',
    o.categoryBarPosition !== 'top' && jsxProp('categoryBarPosition', o.categoryBarPosition),
  ],
};

const element = (component: string, props: string[], indent: string) =>
  [`${indent}<${component}`, ...props.map((p) => `${indent}  ${p}`), `${indent}/>`].join('\n');

const themeLiteral = ({ primary, primaryMuted }: AccentColors) =>
  `{{ colors: { primary: '${primary}', primaryMuted: '${primaryMuted}' } }}`;

/** Copy-ready JSX for the booking field the visitor last touched, with the visitor's props and theme. */
export const buildSnippet = (tab: DemoTab, options: PlaygroundOptions[DemoTab], accent: Accent = ACCENTS[0]) => {
  const component = TAB_COMPONENTS[tab];
  // `options` is the entry for `tab`; TypeScript can't tie the two together through the index.
  const toProps = SNIPPET_PROPS[tab] as (o: PlaygroundOptions[DemoTab]) => (string | false)[];
  const props = toProps(options).filter((p): p is string => !!p);
  if (!accent.theme) {
    return `import { ${component} } from '${PACKAGE}';\n\n${element(component, props, '')}`;
  }
  return [
    `import { ${component}, PickersProvider } from '${PACKAGE}';`,
    '',
    '<PickersProvider',
    `  theme=${themeLiteral(accent.theme.light)}`,
    `  darkTheme=${themeLiteral(accent.theme.dark)}`,
    '>',
    element(component, props, '  '),
    '</PickersProvider>',
  ].join('\n');
};

export const controlValues = (control: Control) => control.values as readonly ControlValue[];

/** The text a segmented control shows for a value: its label when the control has labels, the value otherwise. */
export const valueLabel = (control: Control, value: ControlValue) =>
  'labels' in control ? control.labels[controlValues(control).indexOf(value)] : String(value);

export const swatchColor = (color: string) => ({ '--swatch': color }) as React.CSSProperties;
