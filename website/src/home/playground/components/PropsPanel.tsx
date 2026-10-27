import Link from '@docusaurus/Link';

import { Choices } from '../../../components/Choices';
import { CONTROLS, TAB_COMPONENTS } from '../playground.constants';
import styles from '../playground.module.css';
import type { Control, ControlValue, Playground } from '../playground.types';
import { controlValues, valueLabel } from '../playground.utils';
import { AccentSwatches } from './AccentSwatches';
import { Switch } from './Switch';

const THEME_LABEL_ID = 'prop-theme';

export const PropsPanel = ({ playground, docsHref }: { playground: Playground; docsHref?: string }) => {
  const { tab, options, accent, setOption, setAccent } = playground;
  const values = options[tab] as Record<string, ControlValue>;
  const component = TAB_COMPONENTS[tab];
  return (
    <aside className={styles.panel} aria-label={`${component} props`}>
      <div className={styles.panelHeader}>
        <span className={styles.eyebrow}>Props</span>
        <code className={styles.component}>{`<${component} />`}</code>
      </div>
      <div className={styles.controls}>
        {(CONTROLS[tab] as readonly Control[]).map((control) => {
          const labelId = `prop-${tab}-${control.key}`;
          const value = values[control.key];
          return (
            <div key={control.key} className={styles.control}>
              <span id={labelId} className={styles.controlName}>
                {control.key}
              </span>
              {typeof value === 'boolean' ? (
                <Switch on={value} labelId={labelId} onChange={(v) => setOption(tab, control.key, v)} />
              ) : (
                <Choices
                  label={control.key}
                  labels={controlValues(control).map((option) => valueLabel(control, option))}
                  selected={controlValues(control).indexOf(value)}
                  onChoose={(i) => setOption(tab, control.key, controlValues(control)[i])}
                />
              )}
            </div>
          );
        })}
        <div className={styles.control}>
          <span id={THEME_LABEL_ID} className={styles.controlName}>
            theme
          </span>
          <AccentSwatches value={accent} labelId={THEME_LABEL_ID} onChange={setAccent} />
        </div>
      </div>
      {docsHref && (
        <Link className={styles.docsLink} to={docsHref}>
          All {component} props →
        </Link>
      )}
    </aside>
  );
};
