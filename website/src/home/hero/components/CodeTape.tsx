import styles from '../hero.module.css';
import type { CodeTapeProps } from '../hero.types';
import { formatHeroValue } from '../hero.utils';

/** The one line behind all three devices, and the value they share right now: pick on any device and it changes here. */
export const CodeTape = ({ spec, values }: CodeTapeProps) => {
  const value = formatHeroValue(spec.word, values);
  return (
    <div className={styles.tape}>
      <code className={styles.tapeCode}>
        <span className={styles.tag}>&lt;{spec.tag}</span> {spec.props} <span className={styles.tag}>/&gt;</span>
      </code>
      <span className={styles.tapeValue}>
        {'// '}
        <span key={value} className={styles.tapeTick}>
          {value}
        </span>
        {' on all three'}
      </span>
    </div>
  );
};
