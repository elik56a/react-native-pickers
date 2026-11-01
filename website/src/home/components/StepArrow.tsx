import styles from './Hero.module.css';

interface StepArrowProps {
  direction: 'up' | 'down';
  label: string;
  onPress: () => void;
}

/** A chevron button beside the headline's word that turns its wheel one row. */
export const StepArrow = ({ direction, label, onPress }: StepArrowProps) => (
  <button type="button" className={styles.step} aria-label={label} onClick={onPress}>
    <svg viewBox="0 0 24 24" aria-hidden className={styles[direction]}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  </button>
);
