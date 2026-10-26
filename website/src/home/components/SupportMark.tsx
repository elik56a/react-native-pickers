import clsx from 'clsx';

import { SUPPORT, SUPPORT_LABEL } from '../home.constants';
import shared from '../home.module.css';
import type { CompareCell } from '../home.types';
import styles from './Comparison.module.css';

export const SupportMark = ({ support, note }: CompareCell) => (
  <span className={clsx(styles.mark, styles[support])}>
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      {support === SUPPORT.yes && <path d="M3.5 8.5l3 3 6-7" strokeLinejoin="round" />}
      {support === SUPPORT.partial && <path d="M4 8h8" />}
      {support === SUPPORT.no && <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />}
    </svg>
    <span className={note ? undefined : shared.srOnly}>{note ?? SUPPORT_LABEL[support]}</span>
    {note && <span className={shared.srOnly}> ({SUPPORT_LABEL[support]})</span>}
  </span>
);
