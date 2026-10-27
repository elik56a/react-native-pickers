import { useMemo, useState } from 'react';
import { Text } from 'react-native';

import type { DateRange } from '@elik56a/react-native-pickers';
import { BOOKING_CITY, BOOKING_STAY, CHECK_IN_HOUR, CITIES, DEFAULT_GUESTS } from '../demo.constants';
import { styles } from '../demo.styles';
import type { Guests } from '../demo.types';
import { buildPrices, guestsLabel, startOfToday, stay, stayNights, stayTotal } from '../demo.utils';

const checkInAt = (hour: number) => {
  const time = startOfToday();
  time.setHours(hour);
  return time;
};

/** The hero app's booking: where, when, who, and what it costs. */
export const useBooking = () => {
  const [city, setCity] = useState<string | null>(BOOKING_CITY);
  const [range, setRange] = useState<DateRange>(() => stay(BOOKING_STAY.from, BOOKING_STAY.to));
  const [checkIn, setCheckIn] = useState(() => checkInAt(CHECK_IN_HOUR));
  const [guests, setGuests] = useState<Guests>(DEFAULT_GUESTS);
  const prices = useMemo(buildPrices, []);
  const cities = useMemo(
    () =>
      CITIES.map((c) => ({
        label: c.label,
        value: c.label,
        group: c.group,
        icon: <Text style={styles.flag}>{c.flag}</Text>,
      })),
    []
  );

  const nights = stayNights(range);
  return {
    city,
    setCity,
    cities,
    range,
    setRange,
    prices,
    checkIn,
    setCheckIn,
    guests,
    setGuests,
    guestsLabel: guestsLabel(guests),
    nights,
    summary: `${city ?? 'Anywhere'} · ${nights === 1 ? '1 night' : `${nights} nights`}`,
    total: stayTotal(range),
  };
};
