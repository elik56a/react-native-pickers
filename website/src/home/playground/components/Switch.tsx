import styles from '../playground.module.css';

interface SwitchProps {
  on: boolean;
  labelId: string;
  onChange: (on: boolean) => void;
}

export const Switch = ({ on, labelId, onChange }: SwitchProps) => (
  <button type="button" role="switch" aria-checked={on} aria-labelledby={labelId} className={styles.switch} onClick={() => onChange(!on)}>
    <span className={styles.switchThumb} />
  </button>
);
