import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';

import { PICK_A_FIELD_CODE } from '../playground.constants';
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
      <div key={tab ?? 'none'} className={clsx(styles.codeBody, styles.fadeIn)}>
        {tab ? (
          <CodeBlock language="tsx">{buildSnippet(tab, options[tab], accent)}</CodeBlock>
        ) : (
          <p className={styles.empty}>{PICK_A_FIELD_CODE}</p>
        )}
      </div>
    </div>
  );
};
