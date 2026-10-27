import { Easing, Platform, type PlatformOSType } from 'react-native';

/** The `Platform.OS` values pickers tell apart. Anything else (windows, macos) behaves like native. */
export const PLATFORM = {
  ios: 'ios',
  android: 'android',
  web: 'web',
} as const satisfies Record<string, PlatformOSType>;

/** Desktop browsers can draw a permanent scrollbar track, which looks out of place in phone-style lists. */
export const SHOWS_SCROLL_INDICATOR = Platform.select({ web: false, default: true });

/** react-native-web has no native animated module. Layout props (height) never run on it, whatever the platform. */
export const USE_NATIVE_DRIVER = Platform.OS !== PLATFORM.web;

export const PICKER_DISPLAY = {
  calendar: 'calendar',
  wheel: 'wheel',
} as const;

/** Things arriving decelerate into place; things leaving accelerate away. */
export const EASE_OUT = Easing.out(Easing.cubic);
export const EASE_IN = Easing.in(Easing.cubic);

/** A text field can't hold the hover tint as a child view, so an inset shadow this wide paints it over the background, under the text. */
export const HOVER_FILL_SPREAD = 999;

/** The ripple grows over this multiple of the theme's animation duration, and fades out over the other. */
export const RIPPLE_GROW_RATIO = 1.5;
export const RIPPLE_FADE_RATIO = 1.25;
/** On a quick tap the ripple still spreads this far through its growth before it starts fading. */
export const RIPPLE_MIN_VISIBLE_RATIO = 0.6;
