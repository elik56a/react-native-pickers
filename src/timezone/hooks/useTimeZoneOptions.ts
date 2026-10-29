import { useMemo } from 'react';

import type { TimeZoneListOptions } from '../timezone.types';
import { buildTimeZoneOptions } from '../timezone.utils';

/** The zone options, rebuilt only when a list option changes. */
export const useTimeZoneOptions = ({ timeZones, preferred, preferredLabel, allTimeZonesLabel, locale, date }: TimeZoneListOptions) =>
  useMemo(
    () =>
      buildTimeZoneOptions({
        timeZones,
        preferred,
        preferredLabel,
        allTimeZonesLabel,
        locale,
        date,
      }),
    [timeZones, preferred, preferredLabel, allTimeZonesLabel, locale, date]
  );
