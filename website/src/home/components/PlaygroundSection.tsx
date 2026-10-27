import clsx from 'clsx';

import shared from '../home.module.css';
import { revealAt } from '../home.utils';
import { useDocPath } from '../hooks/useDocPath';
import { LiveCode } from '../playground/components/LiveCode';
import { PropsPanel } from '../playground/components/PropsPanel';
import { usePlayground } from '../playground/hooks/usePlayground';
import { TAB_DOCS } from '../playground/playground.constants';
import { LiveDevice } from './LiveDevice';
import styles from './PlaygroundSection.module.css';

export const PlaygroundSection = () => {
  const playground = usePlayground();
  const docPath = useDocPath();
  return (
    <section className={clsx('container', shared.section)} aria-labelledby="playground-title">
      <h2 id="playground-title" className={shared.h2} data-reveal>
        Play with the pickers
      </h2>
      <p className={clsx(shared.lead, shared.centered)} data-reveal>
        Switch pickers on the phone, try a few of their props, and copy the code it writes for you.
      </p>
      <div className={styles.stage}>
        <div className={styles.props} data-reveal style={revealAt(1)}>
          <PropsPanel playground={playground} docsHref={playground.tab ? docPath(TAB_DOCS[playground.tab]) : undefined} />
        </div>
        <div className={styles.device} data-reveal>
          <LiveDevice playground={playground} />
        </div>
        <div className={styles.code} data-reveal style={revealAt(2)}>
          <LiveCode playground={playground} />
        </div>
      </div>
    </section>
  );
};
