import Link from '@docusaurus/Link';
import clsx from 'clsx';

import shared from '../home.module.css';
import { revealAt } from '../home.utils';

export const AiDocs = () => (
  <section className={clsx('container', shared.section, shared.centered)}>
    <h2 className={shared.h2} data-reveal>
      Docs your AI can read, too
    </h2>
    <p className={shared.lead} data-reveal style={revealAt(1)}>
      The whole API is available as <Link to="pathname:///llms.txt">llms.txt</Link> and{' '}
      <Link to="pathname:///llms-full.txt">llms-full.txt</Link>. Drop it into Cursor, Claude or Copilot and get correct code on the first
      try.
    </p>
  </section>
);
