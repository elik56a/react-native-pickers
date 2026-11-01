import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';

import styles from '../playground.module.css';
import type { Playground } from '../playground.types';
import { buildSnippet } from '../playground.utils';

export const LiveCode = ({ playground }: { playground: Playground }) => {
  const { tab, options, accent } = playground;
  return (
    <div className={styles.liveCode}>
      <div className={styles.liveHeader}>
        <span className={styles.liveDot} aria-hidden />
        Live code
        <span className={styles.liveHint}>updates as you change props</span>
      </div>
      <div key={tab} className={clsx(styles.codeBody, styles.fadeIn)}>
        <CodeBlock language="tsx">{buildSnippet(tab, options[tab], accent)}</CodeBlock>
      </div>
    </div>
  );
};
