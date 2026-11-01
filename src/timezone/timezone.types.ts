import type { Locale } from '../core';
import type { BuiltInSelectPickerProps } from '../select/select.types';

export interface TimeZone {
  /** IANA name, e.g. 'Europe/Lisbon' */
  id: string;
  /** The older IANA name some engines still use, e.g. 'Asia/Calcutta' for 'Asia/Kolkata' */
  alias?: string;
  /** The city, e.g. 'Lisbon' or 'Buenos Aires' */
  city: string;
  /** The first part of the name, e.g. 'Europe' or 'America' */
  region: string;
}

export interface TimeZoneListOptions {
  /** Only these zones, by IANA name. Default: all */
  timeZones?: ReadonlyArray<string>;
  /** Shown first under their own header. Default: the device's zone */
  preferred?: ReadonlyArray<string>;
  /** Header above `preferred`. Default: 'Your time zone' */
  preferredLabel?: string;
  /** Header above the rest when `preferred` is set. Default: 'All time zones' */
  allTimeZonesLabel?: string;
  /** Language of the zone names, where the engine has them. Default: the device locale */
  locale?: Locale;
  /** The moment offsets are worked out for, as they change with daylight saving. Default: now */
  date?: Date;
}

export type TimeZonePickerProps = BuiltInSelectPickerProps<string> & TimeZoneListOptions;
