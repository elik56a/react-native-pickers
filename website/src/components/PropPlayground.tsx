import { type ElementType, type ReactNode, useState } from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';

import { PickersProvider, SelectPicker } from '@elik56a/react-native-pickers';
import type { PlaygroundConfig, PlaygroundControl, PlaygroundOption, PlaygroundSelection } from '../catalog/catalog.types';
import { isSwitch, needsSelect, optionLabel, sameOption } from '../catalog/catalog.utils';
import { usePlayground } from '../catalog/hooks/usePlayground';
import { PLATFORM } from '../home/device/device.constants';
import type { Platform } from '../home/device/device.types';
import { Choices } from './Choices';
import { PlatformRow } from './PlatformSwitch';
import styles from './PropPlayground.module.css';

export type Option = PlaygroundOption;

interface ControlRowProps {
  control: PlaygroundControl;
  selected: Option;
  onChoose: (prop: string, option: Option) => void;
}

interface PreviewProps {
  component: ElementType;
  props: Record<string, unknown>;
  platform: Platform;
  opener?: string;
  children?: ReactNode;
}

/** Sized to the panel: shorter and smaller than a form field. */
const SELECT_STYLES = {
  trigger: { minHeight: 38 },
  triggerText: { fontSize: 13 },
  option: { minHeight: 34, paddingVertical: 6 },
  optionLabel: { fontSize: 13 },
};

const toAttribute = (prop: string, option: Option) => {
  if (option === true) return prop;
  if (typeof option === 'string') return `${prop}="${option}"`;
  if (Array.isArray(option)) return `${prop}={[${option.map((o) => `'${o}'`).join(', ')}]}`;
  return `${prop}={${String(option)}}`;
};

const toCode = (
  name: string,
  code: string | undefined,
  controls: readonly PlaygroundControl[],
  selection: PlaygroundSelection,
  hasChildren: boolean
) => {
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

const Preview = ({ component: Component, props, platform, opener, children }: PreviewProps) => {
  const { colorMode } = useColorMode();
  const [open, setOpen] = useState(false);
  const sheet = opener ? { visible: open, onClose: () => setOpen(false) } : {};

  return (
    <PickersProvider colorScheme={colorMode} platform={platform}>
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
export const PropSelect = ({ prop, options, selected, onChoose }: PropSelectProps) => {
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
              label: optionLabel(option),
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
  const isSelect = needsSelect(options.map(optionLabel));

  if (isSwitch(options)) {
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
        <Choices
          label={prop}
          labels={options.map(optionLabel)}
          selected={options.findIndex((o) => sameOption(selected, o))}
          onChoose={(i) => onChoose(prop, options[i])}
        />
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
  changeProp,
  resetProp,
  opener,
  wide,
  platforms = true,
  children,
}: PlaygroundConfig) {
  const { selection, choose, live } = usePlayground({ name, component, controls, props, value, changeProp, resetProp });
  const [platform, setPlatform] = useState<Platform>(PLATFORM.web);

  return (
    <div className={styles.playground}>
      <div className={styles.body}>
        <div className={styles.preview} data-wide={(wide && platform === PLATFORM.web) || undefined}>
          <div className={styles.stage}>
            <BrowserOnly fallback={null}>
              {() => (
                <Preview component={component} props={live} platform={platform} opener={opener}>
                  {children}
                </Preview>
              )}
            </BrowserOnly>
          </div>
        </div>
        <div className={styles.panel}>
          {platforms ? <PlatformRow platform={platform} onChange={setPlatform} /> : null}
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
