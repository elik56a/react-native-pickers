import { type CSSProperties, type ElementType, type ReactNode, useState } from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';

import { PickersProvider, SelectPicker } from '@elik56a/react-native-pickers';
import styles from './PropPlayground.module.css';

export type Option = string | number | boolean | readonly string[];
type Selection = Record<string, Option>;

interface Control {
  prop: string;
  options: readonly Option[];
  /** The component's own default, left out of the code. `null` when it has none of these (always shown). Defaults to the first option. */
  default?: Option | null;
  /** The option selected at first. Defaults to `default`, then the first option. */
  initial?: Option;
}

interface PropPlaygroundProps {
  /** Component name used in the generated code. */
  name: string;
  component: ElementType;
  controls: readonly Control[];
  /** Props that never change, passed as-is. */
  props?: Record<string, unknown>;
  /** The fixed attributes as they should read in the code, e.g. `items={sizes} value={size} onChange={setSize}`. */
  code?: string;
  /** Makes the demo controlled. A function of the selection is re-run when a control changes (e.g. `mode` changes the value's type). */
  value?: unknown;
  /** The callback that receives the new value. */
  changeProp?: string;
  /** A callback that resets the value, e.g. `onClear`. */
  resetProp?: string;
  /** Renders a button that opens the component, which gets `visible` and `onClose`. */
  opener?: string;
  children?: ReactNode;
}

interface ControlRowProps {
  control: Control;
  selected: Option;
  onChoose: (prop: string, option: Option) => void;
}

interface PreviewProps {
  component: ElementType;
  props: Record<string, unknown>;
  opener?: string;
  children?: ReactNode;
}

const SEGMENTED_MAX_CHARS = 24;

/** Sized to the panel: shorter and smaller than a form field. */
const SELECT_STYLES = {
  trigger: { minHeight: 38 },
  triggerText: { fontSize: 13 },
  option: { minHeight: 34, paddingVertical: 6 },
  optionLabel: { fontSize: 13 },
};

const label = (option: Option) => (Array.isArray(option) ? option.join(' · ') : String(option));

const sameOption = (a: Option, b: Option | null) => JSON.stringify(a) === JSON.stringify(b);

const toAttribute = (prop: string, option: Option) => {
  if (option === true) return prop;
  if (typeof option === 'string') return `${prop}="${option}"`;
  if (Array.isArray(option)) return `${prop}={[${option.map((o) => `'${o}'`).join(', ')}]}`;
  return `${prop}={${String(option)}}`;
};

const toCode = (name: string, code: string | undefined, controls: readonly Control[], selection: Selection, hasChildren: boolean) => {
  const changed = controls
    .filter((c) => !sameOption(selection[c.prop], c.default === undefined ? c.options[0] : c.default))
    .map((c) => toAttribute(c.prop, selection[c.prop]));
  const fixed = code ? code.split(/\s(?=\w+=)/) : [];
  const attributes = [...fixed, ...changed];
  const inline = attributes.length <= 3;
  const head = inline ? `<${name}${attributes.map((a) => ` ${a}`).join('')}` : `<${name}\n${attributes.map((a) => `  ${a}`).join('\n')}\n`;
  if (!hasChildren) return inline ? `${head} />` : `${head}/>`;
  return `${head}>\n  …\n</${name}>`;
};

const initialValue = (value: unknown, selection: Selection) => (typeof value === 'function' ? value(selection) : value);

const Preview = ({ component: Component, props, opener, children }: PreviewProps) => {
  const { colorMode } = useColorMode();
  const [open, setOpen] = useState(false);
  const sheet = opener ? { visible: open, onClose: () => setOpen(false) } : {};

  return (
    <PickersProvider colorScheme={colorMode}>
      {opener ? (
        <button type="button" className="button button--primary button--block" onClick={() => setOpen(true)}>
          {opener}
        </button>
      ) : null}
      <Component {...props} {...sheet}>
        {children}
      </Component>
    </PickersProvider>
  );
};

interface PropSelectProps {
  prop: string;
  options: readonly Option[];
  selected: Option;
  onChoose: (prop: string, option: Option) => void;
}

/** The library's own SelectPicker, as a dropdown; it renders in the browser only, like the previews. */
const PropSelect = ({ prop, options, selected, onChoose }: PropSelectProps) => {
  const { colorMode } = useColorMode();
  return (
    <BrowserOnly fallback={<div className={styles.selectFallback} />}>
      {() => (
        <PickersProvider colorScheme={colorMode}>
          <SelectPicker
            placeholder={prop}
            presentation="dropdown"
            searchable={false}
            options={options.map((option, i) => ({
              label: label(option),
              value: i,
            }))}
            value={options.findIndex((o) => sameOption(selected, o))}
            onChange={(i) => onChoose(prop, options[i])}
            styles={SELECT_STYLES}
          />
        </PickersProvider>
      )}
    </BrowserOnly>
  );
};

export const ControlRow = ({ control, selected, onChoose }: ControlRowProps) => {
  const { prop, options } = control;
  const isSwitch = options.length === 2 && options.every((o) => typeof o === 'boolean');
  const isSelect = options.map(label).join('').length > SEGMENTED_MAX_CHARS;
  const activeIndex = options.findIndex((o) => sameOption(selected, o));
  // The segmented control's thumb slides to the active segment; its CSS reads both.
  const thumbPosition = { '--count': options.length, '--index': activeIndex } as CSSProperties;

  if (isSwitch) {
    return (
      <label className={`${styles.row} ${styles.inline}`}>
        <code className={styles.prop}>{prop}</code>
        <input
          type="checkbox"
          role="switch"
          aria-checked={selected === true}
          className={styles.switch}
          checked={selected === true}
          onChange={(e) => onChoose(prop, e.target.checked)}
        />
      </label>
    );
  }

  return (
    <div className={styles.row}>
      <code className={styles.prop}>{prop}</code>
      {isSelect ? (
        <PropSelect prop={prop} options={options} selected={selected} onChoose={onChoose} />
      ) : (
        <fieldset className={styles.segmented} aria-label={prop}>
          {activeIndex === -1 ? null : <span className={styles.thumb} aria-hidden="true" style={thumbPosition} />}
          {options.map((option) => {
            const active = sameOption(selected, option);
            return (
              <button
                key={label(option)}
                type="button"
                aria-pressed={active}
                className={active ? `${styles.segment} ${styles.active}` : styles.segment}
                onClick={() => onChoose(prop, option)}
              >
                {label(option)}
              </button>
            );
          })}
        </fieldset>
      )}
    </div>
  );
};

/** A live component with buttons for each prop option, and the code for the current choice. */
export default function PropPlayground({
  name,
  component,
  controls,
  props,
  code,
  value,
  changeProp = 'onChange',
  resetProp,
  opener,
  children,
}: PropPlaygroundProps) {
  const [selection, setSelection] = useState<Selection>(() =>
    Object.fromEntries(controls.map((c) => [c.prop, c.initial ?? c.default ?? c.options[0]]))
  );
  const [current, setCurrent] = useState(() => initialValue(value, selection));

  const choose = (prop: string, option: Option) => {
    const next = { ...selection, [prop]: option };
    setSelection(next);
    if (typeof value === 'function') setCurrent(initialValue(value, next));
  };

  const live = {
    ...props,
    ...selection,
    ...(value === undefined ? {} : { value: current, [changeProp]: setCurrent }),
    ...(resetProp ? { [resetProp]: () => setCurrent(initialValue(value, selection)) } : {}),
  };

  return (
    <div className={styles.playground}>
      <div className={styles.body}>
        <div className={styles.preview}>
          <div className={styles.stage}>
            <BrowserOnly fallback={null}>
              {() => (
                <Preview component={component} props={live} opener={opener}>
                  {children}
                </Preview>
              )}
            </BrowserOnly>
          </div>
        </div>
        <div className={styles.panel}>
          {controls.map((control) => (
            <ControlRow key={control.prop} control={control} selected={selection[control.prop]} onChoose={choose} />
          ))}
        </div>
      </div>
      <CodeBlock language="tsx" className={styles.code}>
        {toCode(name, code, controls, selection, !!children)}
      </CodeBlock>
    </div>
  );
}
