import Link from '@docusaurus/Link';
import clsx from 'clsx';

import { COMPARE_COLUMNS, COMPARE_ROWS } from '../home.constants';
import shared from '../home.module.css';
import styles from './Comparison.module.css';
import { SupportMark } from './SupportMark';

export const Comparison = () => (
  <section className={clsx('container', shared.section)} aria-labelledby="compare-title">
    <h2 id="compare-title" className={shared.h2} data-reveal>
      How it compares to other React Native pickers
    </h2>
    <p className={clsx(shared.lead, shared.centered)} data-reveal>
      Most apps combine a native date picker, a calendar library and a select wrapper. Here is what one package covers instead.
    </p>
    <div className={styles.tableScroll} data-reveal>
      <table className={styles.compare}>
        <caption className={shared.srOnly}>
          React Native Pickers compared with native OS pickers, calendar libraries and select wrappers
        </caption>
        <thead>
          <tr>
            <td />
            {COMPARE_COLUMNS.map((col, i) => (
              <th key={col.name} scope="col" className={clsx(i === 0 && styles.ours)}>
                <span className={styles.colName}>{col.name}</span>
                <span className={styles.colExamples}>{col.examples}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.feature}>
              <th scope="row">{row.feature}</th>
              {row.cells.map((cell, i) => (
                <td key={COMPARE_COLUMNS[i]?.name} className={clsx(i === 0 && styles.ours)}>
                  <SupportMark {...cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className={shared.sectionLink}>
      <Link to="/docs/resources/comparison">Full comparison, and when to choose something else →</Link>
    </p>
  </section>
);
