import Link from '@docusaurus/Link';
import clsx from 'clsx';

import { COMPONENT_GROUPS, COMPONENTS } from '../home.constants';
import shared from '../home.module.css';
import { revealAt } from '../home.utils';
import { useDocPath } from '../hooks/useDocPath';
import styles from './ComponentGrid.module.css';

/** The catalog as a spec sheet: a ruled column per job, each name over what it does. */
export const ComponentGrid = () => {
  const docPath = useDocPath();
  return (
    <section className={clsx('container', shared.section)} aria-labelledby="catalog-title">
      <p className={shared.eyebrow} data-reveal>
        Catalog
      </p>
      <h2 id="catalog-title" className={shared.h2} data-reveal>
        {COMPONENTS.length} components, one package
      </h2>
      <div className={styles.groups}>
        {COMPONENT_GROUPS.map((group, i) => (
          <div key={group.title} className={styles.group} data-reveal style={revealAt(i)}>
            <h3 className={styles.groupTitle}>
              {group.title}
              <span className={styles.count}>{group.items.length}</span>
            </h3>
            <ul className={styles.list}>
              {group.items.map((c) => (
                <li key={c.name}>
                  <Link to={docPath(c.doc)} className={styles.item}>
                    <span className={styles.name}>{c.name}</span>
                    <span className={styles.body}>{c.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
