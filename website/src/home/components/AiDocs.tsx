import Link from '@docusaurus/Link';
import clsx from 'clsx';

import { AGENT_LINKS, AGENT_PROMPT } from '../home.constants';
import shared from '../home.module.css';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import styles from './AiDocs.module.css';

/** For the AI that will write the code: the prompt to give it, set large, and the plain-text docs behind it. */
export const AiDocs = () => {
  const { copied, copy } = useCopyToClipboard(AGENT_PROMPT);
  return (
    <section className={styles.band} aria-labelledby="agents-title">
      <div className={clsx('container', styles.inner)}>
        <div className={styles.title} data-reveal>
          <p className={clsx(shared.eyebrow, styles.eyebrow)}>For your AI</p>
          <h2 id="agents-title" className={clsx(shared.h2, styles.heading)}>
            Paste this into your AI
          </h2>
        </div>
        <button type="button" className={styles.prompt} onClick={copy} data-reveal>
          <span className={styles.promptText}>{AGENT_PROMPT}</span>
          <span className={styles.copy}>{copied ? 'Copied' : 'Copy prompt'}</span>
        </button>
        <ul className={styles.links}>
          {AGENT_LINKS.map((link) => (
            <li key={link.label}>
              <Link to={link.href}>{link.label}</Link>
              <span>{link.body}</span>
            </li>
          ))}
        </ul>
        <p className={clsx(shared.lead, styles.note)}>
          The docs are written for people and for agents alike: every page is plain text at the links above, so Cursor, Claude or Copilot
          reads the real API instead of guessing it.
        </p>
      </div>
    </section>
  );
};
