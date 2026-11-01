import { useMemo, useState } from 'react';

import type { CountryCode, DateRange } from '@elik56a/react-native-pickers';
import type { PlaygroundOptions } from '../../playground/playground.types';
import {
  BOOKING_CITY,
  BOOKING_COUNTRY,
  BOOKING_DAY,
  BOOKING_DAYS,
  BOOKING_STAY,
  BOOKING_STAYS,
  CHECK_IN_HOUR,
  CITIES,
  DEFAULT_CITIES,
  DEFAULT_GUESTS,
  DEFAULT_VIBE,
} from '../demo.constants';
import type { Guests } from '../demo.types';
import { bookedNights, buildPrices, daysFromNow, daysFromNowAt, nightsTotal, plural, stay } from '../demo.utils';
import { useFlagOptions } from './useFlagOptions';

/** The booking app's state: where, when, who, where they're from and the vibe, with the Dates field's pick kept for each calendar mode. */
export const useBooking = (options: PlaygroundOptions) => {
  const [city, setCity] = useState<string | null>(BOOKING_CITY);
  const [cities, setCities] = useState<string[]>(DEFAULT_CITIES);
  const [date, setDate] = useState<Date | null>(() => daysFromNow(BOOKING_DAY));
  const [range, setRange] = useState<DateRange>(() => stay(BOOKING_STAY.from, BOOKING_STAY.to));
  const [dates, setDates] = useState<Date[]>(() => BOOKING_DAYS.map(daysFromNow));
  const [ranges, setRanges] = useState<DateRange[]>(() => BOOKING_STAYS.map(([from, to]) => stay(from, to)));
  const [checkIn, setCheckIn] = useState(() => daysFromNowAt(0, CHECK_IN_HOUR));
  const [guests, setGuests] = useState<Guests>(DEFAULT_GUESTS);
  const [vibe, setVibe] = useState(DEFAULT_VIBE);
  const [country, setCountry] = useState<CountryCode | null>(BOOKING_COUNTRY);
  const prices = useMemo(buildPrices, []);
  const cityOptions = useFlagOptions(CITIES, options.select.groups);

  const picked = { single: date, range, multiple: dates, ranges }[options.date.mode];
  const nights = bookedNights(picked);
  const where = options.select.multiple ? cities.join(', ') : city;
  return {
    city,
    setCity,
    cities,
    setCities,
    cityOptions,
    date,
    setDate,
    range,
    setRange,
    dates,
    setDates,
    ranges,
    setRanges,
    prices,
    checkIn,
    setCheckIn,
    guests,
    setGuests,
    vibe,
    setVibe,
    country,
    setCountry,
    nights: nights.length,
    summary: `${where || 'Anywhere'} · ${plural(nights.length, 'night')}`,
    total: nightsTotal(nights),
  };
};

export type Booking = ReturnType<typeof useBooking>;
