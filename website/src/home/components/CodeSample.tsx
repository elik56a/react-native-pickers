import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';

import { SAMPLE } from '../home.constants';
import shared from '../home.module.css';
import { revealAt } from '../home.utils';
import styles from './CodeSample.module.css';

export const CodeSample = () => (
  <section className={clsx('container', shared.section, styles.split)}>
    <div data-reveal>
      <h2 className={shared.h2Left}>Feels native. Isn&apos;t.</h2>
      <p className={clsx(shared.lead, shared.leadLeft)}>
        The same <code>value</code> / <code>onChange</code> API everywhere, typed down to the selection mode. Sheets keep a draft and commit
        on Done, just like the system pickers, but they match your design on every platform.
      </p>
      <ul className={styles.checks}>
        <li>Controlled or uncontrolled</li>
        <li>Light and dark themes that follow the OS</li>
        <li>No Reanimated, Gesture Handler or SVG</li>
        <li>Full TypeScript types</li>
      </ul>
      <Link to="/docs/getting-started/core-concepts">Core concepts →</Link>
    </div>
    <div data-reveal style={revealAt(2)}>
      <CodeBlock language="tsx">{SAMPLE}</CodeBlock>
    </div>
  </section>
);
