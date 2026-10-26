import { HERO_CHIPS, HERO_CHIPS_FIRST_STEP } from '../home.constants';
import { revealDelay } from '../home.utils';
import styles from './HeroChips.module.css';

export const HeroChips = () =>
  HERO_CHIPS.map((chip, i) => (
    <span key={chip.text} className={styles.chip} style={revealDelay(HERO_CHIPS_FIRST_STEP + i * 2)} aria-hidden>
      <span>{chip.icon}</span>
      {chip.text}
    </span>
  ));
