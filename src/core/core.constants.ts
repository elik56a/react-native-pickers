import { Platform } from 'react-native';

/** Desktop browsers can draw a permanent scrollbar track, which looks out of place in phone-style lists. */
export const SHOWS_SCROLL_INDICATOR = Platform.select({ web: false, default: true });

/** react-native-web has no native animated module. */
export const USE_NATIVE_DRIVER = Platform.OS !== 'web';

/** The ripple grows over this multiple of the theme's animation duration, and fades out over the other. */
export const RIPPLE_GROW_RATIO = 1.5;
export const RIPPLE_FADE_RATIO = 1.25;
/** On a quick tap the ripple still spreads this far through its growth before it starts fading. */
export const RIPPLE_MIN_VISIBLE_RATIO = 0.6;
