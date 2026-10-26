import clsx from 'clsx';

import { ACCENTS } from '../playground.constants';
import styles from '../playground.module.css';
import type { Accent } from '../playground.types';
import { swatchColor } from '../playground.utils';

interface AccentSwatchesProps {
  value: Accent;
  labelId: string;
  onChange: (accent: Accent) => void;
}

export const AccentSwatches = ({ value, labelId, onChange }: AccentSwatchesProps) => (
  <div role="radiogroup" aria-labelledby={labelId} className={styles.swatches}>
    {ACCENTS.map((accent) => (
      <label
        key={accent.key}
        title={accent.label}
        className={clsx(styles.swatch, accent.key === value.key && styles.swatchOn)}
        style={swatchColor(accent.swatch)}
      >
        <input
          type="radio"
          name={labelId}
          aria-label={accent.label}
          className={styles.radioInput}
          checked={accent.key === value.key}
          onChange={() => onChange(accent)}
        />
      </label>
    ))}
  </div>
);
