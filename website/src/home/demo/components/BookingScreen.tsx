import { View } from 'react-native';

import { CountryPicker, EmojiPickerField, TimePickerField } from '@elik56a/react-native-pickers';
import { DEFAULT_OPTIONS } from '../../playground/playground.constants';
import { BOOKING_FIELD, PREFERRED_COUNTRIES } from '../demo.constants';
import { styles } from '../demo.styles';
import type { BookingScreenProps } from '../demo.types';
import { deviceSheetProps } from '../demo.utils';
import { useBooking } from '../hooks/useBooking';
import { ActionButton } from './ActionButton';
import { AppScreen } from './AppScreen';
import { DatesField } from './DatesField';
import { GuestsField } from './GuestsField';
import { WhereField } from './WhereField';

const EMOJI_HEIGHT = 300;

/**
 * A booking form whose every field opens one of the pickers: a searchable select, a priced calendar, the time, the emojis, two
 * wheels and the guest's country.
 */
export const BookingScreen = ({ platform, screenHeight }: BookingScreenProps) => {
  const options = DEFAULT_OPTIONS;
  const booking = useBooking(options);
  const sheetProps = deviceSheetProps(platform, screenHeight);
  return (
    <AppScreen
      platform={platform}
      title={`Book a stay ${booking.vibe}`}
      subtitle={booking.summary}
      action={
        <ActionButton label={`Reserve · $${booking.total}`} busyLabel="Reserving…" doneLabel="✓ Reserved" disabled={!booking.nights} />
      }
    >
      <WhereField booking={booking} sheetProps={sheetProps} />
      <DatesField booking={booking} sheetProps={sheetProps} />
      <View style={styles.pair}>
        <View style={styles.half}>
          <TimePickerField
            label={BOOKING_FIELD.checkIn}
            value={booking.checkIn}
            onConfirm={booking.setCheckIn}
            format={options.time.format}
            minuteInterval={options.time.minuteInterval}
            showSeconds={options.time.showSeconds}
            sheetProps={sheetProps}
          />
        </View>
        <View style={styles.half}>
          <EmojiPickerField
            label={BOOKING_FIELD.vibe}
            value={booking.vibe}
            onSelect={booking.setVibe}
            height={EMOJI_HEIGHT}
            columns={options.emoji.columns}
            showSkinTones={options.emoji.showSkinTones}
            categoryBarPosition={options.emoji.categoryBarPosition}
            sheetProps={sheetProps}
          />
        </View>
      </View>
      <View style={styles.pair}>
        <View style={styles.half}>
          <GuestsField value={booking.guests} onConfirm={booking.setGuests} sheetProps={sheetProps} options={options.wheel} />
        </View>
        <View style={styles.half}>
          <CountryPicker
            label={BOOKING_FIELD.country}
            value={booking.country}
            onChange={booking.setCountry}
            preferred={PREFERRED_COUNTRIES}
            sheet={{ sheetProps }}
          />
        </View>
      </View>
    </AppScreen>
  );
};
