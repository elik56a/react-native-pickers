import { INSTALL } from '../home.constants';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import styles from './CopyInstall.module.css';

export const CopyInstall = () => {
  const { copied, copy } = useCopyToClipboard(INSTALL);
  return (
    <button type="button" className={styles.install} onClick={copy} aria-label="Copy install command">
      <span className={styles.prompt}>$</span>
      <code>{INSTALL}</code>
      <span className={styles.copy}>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};
