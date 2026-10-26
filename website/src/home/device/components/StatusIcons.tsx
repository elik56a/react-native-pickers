import styles from '../device.module.css';

export const IosStatusIcons = () => (
  <span className={styles.statusIcons} aria-hidden>
    <svg aria-hidden="true" width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      <rect x="0" y="7" width="3" height="4" rx="1" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" />
    </svg>
    <svg aria-hidden="true" width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 2.5c2.3 0 4.4.9 6 2.4l1-1A9.9 9.9 0 0 0 8 1 9.9 9.9 0 0 0 1 3.9l1 1A8.5 8.5 0 0 1 8 2.5Zm0 3c1.5 0 2.9.6 3.9 1.5l1-1A7 7 0 0 0 8 4 7 7 0 0 0 3.1 6l1 1A5.6 5.6 0 0 1 8 5.5Zm0 3c.7 0 1.3.3 1.8.7L8 11 6.2 9.2c.5-.4 1.1-.7 1.8-.7Z" />
    </svg>
    <svg aria-hidden="true" width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
      <rect x=".5" y=".5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity=".4" />
      <rect x="2" y="2" width="16" height="8" rx="1.6" />
      <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" opacity=".4" />
    </svg>
  </span>
);

export const AndroidStatusIcons = () => (
  <span className={styles.statusIcons} aria-hidden>
    <svg aria-hidden="true" width="15" height="12" viewBox="0 0 24 19" fill="currentColor">
      <path d="M12 18.5 0 5.4C3.3 2.4 7.5.8 12 .8s8.7 1.6 12 4.6Z" />
    </svg>
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
      <path d="M20 0v20H0Z" />
    </svg>
    <svg aria-hidden="true" width="22" height="12" viewBox="0 0 22 12" fill="currentColor">
      <rect x=".75" y=".75" width="18" height="10.5" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".45" />
      <rect x="2.5" y="2.5" width="12" height="7" rx="1.5" />
      <rect x="20" y="4" width="1.6" height="4" rx=".8" opacity=".45" />
    </svg>
  </span>
);
