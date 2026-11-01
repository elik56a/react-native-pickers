import Link from '@docusaurus/Link';

import { needsSelect } from '../../../catalog/catalog.utils';
import { Choices } from '../../../components/Choices';
import { PropSelect } from '../../../components/PropPlayground';
import { CONTROLS, FIELD_LABELS, FIELD_TABS, TAB_COMPONENTS } from '../playground.constants';
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

/** The booking fields to pick from, then the props of the picker behind the one picked; the theme applies to the whole app. */
export const PropsPanel = ({ playground, docsHref }: { playground: Playground; docsHref?: string }) => {
  const { tab, accent, setAccent, selectTab } = playground;
  const component = TAB_COMPONENTS[tab];
  return (
    <aside className={styles.panel} aria-label={`${component} props`}>
      <div className={styles.fields}>
        <span className={styles.eyebrow}>Field</span>
        <Choices
          label="Booking field"
          labels={FIELD_LABELS}
          selected={FIELD_TABS.findIndex((field) => field.tab === tab)}
          onChoose={(i) => selectTab(FIELD_TABS[i].tab)}
        />
      </div>
      {/* Keyed by picker, so its props fade in when another field is picked. */}
      <div key={tab} className={styles.fadeIn}>
        <div className={styles.panelHeader}>
          <span className={styles.eyebrow}>Component</span>
          <code className={styles.component}>{`<${component} />`}</code>
          {docsHref && (
            <Link className={styles.docsLink} to={docsHref}>
              All props →
            </Link>
          )}
        </div>
        <Controls tab={tab} playground={playground} />
        <div className={styles.control}>
          <span id={THEME_LABEL_ID} className={styles.controlName}>
            theme
          </span>
          <AccentSwatches value={accent} labelId={THEME_LABEL_ID} onChange={setAccent} />
        </div>
      </div>
    </aside>
  );
};
