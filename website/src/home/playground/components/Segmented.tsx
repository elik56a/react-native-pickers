import clsx from 'clsx';

import styles from '../playground.module.css';
import type { Control, ControlValue } from '../playground.types';
import { controlValues, valueLabel } from '../playground.utils';

interface SegmentedProps {
  control: Control;
  value: ControlValue;
  labelId: string;
  onChange: (value: ControlValue) => void;
}

export const Segmented = ({ control, value, labelId, onChange }: SegmentedProps) => (
  <div role="radiogroup" aria-labelledby={labelId} className={styles.segmented}>
    {controlValues(control).map((option) => (
      <label key={String(option)} className={clsx(styles.segment, option === value && styles.segmentOn)}>
        <input type="radio" name={labelId} className={styles.radioInput} checked={option === value} onChange={() => onChange(option)} />
        {valueLabel(control, option)}
      </label>
    ))}
  </div>
);
