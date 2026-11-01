import type { ComponentType } from 'react';

import { DatePicker, EmojiPicker, MultiWheelPicker, SelectList, TimePicker } from '@elik56a/react-native-pickers';
import { HERO_MIN_EMOJI_HEIGHT } from '../../hero/hero.constants';
import { fillHeight } from '../../hero/hero.utils';
import type { DemoTab, PlaygroundOptions } from '../../playground/playground.types';
import { DAY_HEIGHT, PLAYGROUND_EMOJI_CHROME, PLAYGROUND_LIST_CHROME, SELECT_LIST_HEIGHT } from '../demo.constants';
import { guestColumns, startOfToday } from '../demo.utils';
import type { Booking } from '../hooks/useBooking';

interface PlaygroundPickerProps {
  booking: Booking;
  options: PlaygroundOptions;
  screenHeight?: number;
}

const DatePickerDemo = ({ booking, options: { date } }: PlaygroundPickerProps) => {
  const common = {
    minDate: startOfToday(),
    dayHeight: DAY_HEIGHT,
    markedDates: date.prices ? booking.prices : undefined,
    firstDayOfWeek: date.firstDayOfWeek,
  };
  if (date.mode === 'single') return <DatePicker {...common} value={booking.date} onChange={booking.setDate} />;
  if (date.mode === 'multiple') return <DatePicker {...common} mode="multiple" value={booking.dates} onChange={booking.setDates} />;
  if (date.mode === 'ranges') return <DatePicker {...common} mode="ranges" value={booking.ranges} onChange={booking.setRanges} />;
  return <DatePicker {...common} mode="range" value={booking.range} onChange={booking.setRange} />;
};

/** Each playground picker open on the phone, on the booking's state, with the props panel's options. */
export const PLAYGROUND_PICKERS: Record<DemoTab, ComponentType<PlaygroundPickerProps>> = {
  date: DatePickerDemo,
  time: ({ booking, options: { time } }) => (
    <TimePicker
      value={booking.checkIn}
      onChange={booking.setCheckIn}
      format={time.format}
      minuteInterval={time.minuteInterval}
      showSeconds={time.showSeconds}
    />
  ),
  wheel: ({ booking, options: { wheel } }) => (
    <MultiWheelPicker
      variant={wheel.variant}
      visibleItems={wheel.visibleItems}
      columns={guestColumns(booking.guests, booking.setGuests, wheel.loop)}
    />
  ),
  select: ({ booking, options: { select }, screenHeight }) => {
    const shared = {
      options: booking.cityOptions,
      searchable: select.searchable,
      loading: select.loading,
      listHeight: fillHeight(screenHeight, PLAYGROUND_LIST_CHROME, SELECT_LIST_HEIGHT),
    };
    return select.multiple ? (
      <SelectList {...shared} multiple value={booking.cities} onChange={booking.setCities} />
    ) : (
      <SelectList {...shared} value={booking.city} onChange={booking.setCity} />
    );
  },
  emoji: ({ booking, options: { emoji }, screenHeight }) => (
    <EmojiPicker
      onSelect={booking.setVibe}
      height={fillHeight(screenHeight, PLAYGROUND_EMOJI_CHROME, HERO_MIN_EMOJI_HEIGHT)}
      columns={emoji.columns}
      showSkinTones={emoji.showSkinTones}
      categoryBarPosition={emoji.categoryBarPosition}
    />
  ),
};
