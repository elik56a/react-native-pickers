import { PLATFORM, PLATFORM_LABELS, PLATFORMS } from '../device.constants';
import styles from '../device.module.css';
import type { Platform } from '../device.types';

/** Outlines of the three mocks themselves: an iPhone with its island, a Pixel with its punch hole, a browser window. */
const ICONS: Record<Platform, React.ReactNode> = {
  [PLATFORM.ios]: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10.5 5.5h3" />
    </>
  ),
  [PLATFORM.android]: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <circle cx="12" cy="5.5" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  [PLATFORM.web]: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M2.5 8.5h19M5.5 6.5h.01M7.5 6.5h.01" />
    </>
  ),
};

interface PlatformIconProps {
  platform: Platform;
  size?: number;
  /** Default: the text color around it */
  color?: string;
}

export const PlatformIcon = ({ platform, size = 22, color = 'currentColor' }: PlatformIconProps) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    color={color}
    strokeWidth="1.7"
    strokeLinecap="round"
  >
    {ICONS[platform]}
  </svg>
);

/** iOS / Android / Web as a slim rail beside the device, so switching costs no height above it. */
export const PlatformRail = ({ value, onChange }: { value: Platform; onChange: (platform: Platform) => void }) => (
  <fieldset className={styles.rail} aria-label="Preview platform">
    {PLATFORMS.map((platform) => (
      <button
        key={platform}
        type="button"
        className={styles.railButton}
        aria-pressed={platform === value}
        onClick={() => onChange(platform)}
      >
        <PlatformIcon platform={platform} />
        {PLATFORM_LABELS[platform]}
      </button>
    ))}
  </fieldset>
);
