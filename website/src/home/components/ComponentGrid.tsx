import Link from '@docusaurus/Link';
import clsx from 'clsx';

import { COMPONENTS } from '../home.constants';
import shared from '../home.module.css';
import { revealAt } from '../home.utils';
import { useDocPath } from '../hooks/useDocPath';
import styles from './ComponentGrid.module.css';

export const ComponentGrid = () => {
  const docPath = useDocPath();
  return (
    <section className={clsx('container', shared.section)}>
      <h2 className={shared.h2} data-reveal>
        One package. One API. Every picker.
      </h2>
      <div className={styles.components}>
        {COMPONENTS.map((c, i) => (
          <Link key={c.name} to={docPath(c.doc)} className={styles.componentCard} data-reveal style={revealAt(i)}>
            <strong>{c.name}</strong>
            <span>{c.body}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
