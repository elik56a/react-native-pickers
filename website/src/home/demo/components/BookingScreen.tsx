import { Text, View } from 'react-native';

import { EmojiPickerField, TimePickerField, usePickerTheme } from '@elik56a/react-native-pickers';
import { PLATFORM } from '../../device/device.constants';
import { DEFAULT_OPTIONS, DEMO_TAB } from '../../playground/playground.constants';
import type { DemoTab } from '../../playground/playground.types';
import { BOOKING_FIELD } from '../demo.constants';
import { styles } from '../demo.styles';
import type { BookingScreenProps } from '../demo.types';
import { deviceSheetProps } from '../demo.utils';
import { useBooking } from '../hooks/useBooking';
import { DatesField } from './DatesField';
import { GuestsField } from './GuestsField';
import { ReserveButton } from './ReserveButton';
import { WhereField } from './WhereField';

const EMOJI_HEIGHT = 300;

/**
 * A booking form whose every field opens one of the pickers: a searchable select, a priced calendar, the time, two wheels and the
 * emojis. In the playground, touching a field points the props panel at its picker, and the panel's props shape the fields.
 */
export const BookingScreen = ({ platform, screenHeight, playground }: BookingScreenProps) => {
  const { colors } = usePickerTheme();
  const options = playground?.options ?? DEFAULT_OPTIONS;
  const booking = useBooking(options);
  const sheetProps = deviceSheetProps(platform, screenHeight);
  // Capturing without claiming the touch: the field still opens.
  const pointsAt = (tab: DemoTab) => ({
    onStartShouldSetResponderCapture: () => {
      playground?.selectTab(tab);
      return false;
    },
  });
  return (
    <View style={[styles.root, platform === PLATFORM.web && styles.browserRoot, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Book a stay {booking.vibe}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{booking.summary}</Text>
      </View>
      <View style={styles.booking}>
        <View {...pointsAt(DEMO_TAB.select)}>
          <WhereField booking={booking} options={options.select} sheetProps={sheetProps} />
        </View>
        <View {...pointsAt(DEMO_TAB.date)}>
          <DatesField booking={booking} options={options.date} sheetProps={sheetProps} />
        </View>
        <View style={styles.pair}>
          <View style={styles.half} {...pointsAt(DEMO_TAB.time)}>
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
          <View style={styles.half} {...pointsAt(DEMO_TAB.emoji)}>
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
        <View {...pointsAt(DEMO_TAB.wheel)}>
          <GuestsField value={booking.guests} onConfirm={booking.setGuests} sheetProps={sheetProps} options={options.wheel} />
        </View>
      </View>
      <ReserveButton total={booking.total} disabled={!booking.nights} />
    </View>
  );
};
