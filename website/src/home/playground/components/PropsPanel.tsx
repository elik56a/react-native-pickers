import Link from '@docusaurus/Link';
import clsx from 'clsx';

import { needsSelect } from '../../../catalog/catalog.utils';
import { Choices } from '../../../components/Choices';
import { PropSelect } from '../../../components/PropPlayground';
import { CONTROLS, PICK_A_FIELD, TAB_COMPONENTS } from '../playground.constants';
import styles from '../playground.module.css';
import type { Control, ControlValue, DemoTab, Playground } from '../playground.types';
import { controlValues, valueLabel } from '../playground.utils';
import { AccentSwatches } from './AccentSwatches';
import { Switch } from './Switch';

const THEME_LABEL_ID = 'prop-theme';

interface ControlsProps {
  tab: DemoTab;
  playground: Playground;
}

const Controls = ({ tab, playground: { options, setOption } }: ControlsProps) => {
  const values = options[tab] as Record<string, ControlValue>;
  return (CONTROLS[tab] as readonly Control[]).map((control) => {
    const labelId = `prop-${tab}-${control.key}`;
    const value = values[control.key];
    const labels = controlValues(control).map((option) => valueLabel(control, option));
    return (
      <div key={control.key} className={styles.control}>
        <span id={labelId} className={styles.controlName}>
          {control.key}
        </span>
        {typeof value === 'boolean' ? (
          <Switch on={value} labelId={labelId} onChange={(v) => setOption(tab, control.key, v)} />
        ) : needsSelect(labels) ? (
          <PropSelect
            prop={control.key}
            options={controlValues(control)}
            selected={value}
            onChoose={(_, option) => setOption(tab, control.key, option as ControlValue)}
          />
        ) : (
          <Choices
            label={control.key}
            labels={labels}
            selected={controlValues(control).indexOf(value)}
            onChoose={(i) => setOption(tab, control.key, controlValues(control)[i])}
          />
        )}
      </div>
    );
  });
};

/** The props of the picker behind the booking field last touched, or a hint to touch one; the theme applies to the whole app. */
export const PropsPanel = ({ playground, docsHref }: { playground: Playground; docsHref?: string }) => {
  const { tab, accent, setAccent } = playground;
  const component = tab && TAB_COMPONENTS[tab];
  return (
    <aside className={styles.panel} aria-label={component ? `${component} props` : 'Props'}>
      {/* Keyed by picker, so its props fade in when another field is touched. */}
      <div key={tab ?? 'none'} className={clsx(styles.swap, styles.fadeIn)}>
        <div className={styles.panelHeader}>
          <span className={styles.eyebrow}>Props</span>
          {component ? <code className={styles.component}>{`<${component} />`}</code> : <p className={styles.hint}>{PICK_A_FIELD}</p>}
        </div>
        <div className={styles.controls}>
          {tab ? <Controls tab={tab} playground={playground} /> : null}
          <div className={styles.control}>
            <span id={THEME_LABEL_ID} className={styles.controlName}>
              theme
            </span>
            <AccentSwatches value={accent} labelId={THEME_LABEL_ID} onChange={setAccent} />
          </div>
        </div>
        {component && docsHref && (
          <Link className={styles.docsLink} to={docsHref}>
            All {component} props →
          </Link>
        )}
      </div>
    </aside>
  );
};
