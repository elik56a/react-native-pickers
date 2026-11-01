import type { CountryCode, CurrencyCode } from '@elik56a/react-native-pickers';
import { labelOptions } from '../home/demo/demo.utils';
import type { Album, ApplicationValues, ChatMessage, ShowcaseItem, TimerPreset } from './showcase.types';

export const SHOWCASE_SCREEN = {
  booking: 'booking',
  flights: 'flights',
  table: 'table',
  alarm: 'alarm',
  meeting: 'meeting',
  timer: 'timer',
  chat: 'chat',
  signUp: 'signUp',
  shop: 'shop',
  habit: 'habit',
  trips: 'trips',
  delivery: 'delivery',
  display: 'display',
  verify: 'verify',
  review: 'review',
  albums: 'albums',
  application: 'application',
  store: 'store',
  send: 'send',
  exchange: 'exchange',
} as const;

export const SHOWCASE: ShowcaseItem[] = [
  {
    key: SHOWCASE_SCREEN.booking,
    title: 'Book a stay',
    blurb: 'A searchable city list, a priced range calendar, the check-in time, an emoji, two guest wheels and the guest’s country.',
    components: ['SelectPicker', 'DatePickerField', 'TimePickerField', 'EmojiPickerField', 'MultiWheelPicker', 'CountryPicker'],
    recipe: 'booking-range',
  },
  {
    key: SHOWCASE_SCREEN.flights,
    title: 'Flight search',
    blurb: 'Round trip or one way switches the calendar between a range and a single day.',
    components: ['HorizontalList', 'SelectPicker', 'DatePickerField', 'WheelPickerField'],
    recipe: 'flight-search-form',
  },
  {
    key: SHOWCASE_SCREEN.alarm,
    title: 'Alarm',
    blurb: 'Wheels on iOS, a clock dial in Material and columns of hours on the web, from the same TimePicker.',
    components: ['TimePicker', 'HorizontalList'],
    recipe: 'alarm-time',
  },
  {
    key: SHOWCASE_SCREEN.application,
    title: 'Job application',
    blurb:
      'Send it empty to see every field’s error, then watch each clear as you fix it. The interview has to fall before the first day, a rule the form checks across two fields.',
    components: ['SelectPicker', 'CountryPicker', 'PhoneField', 'DatePickerField', 'DateTimePickerField'],
  },
  {
    key: SHOWCASE_SCREEN.display,
    title: 'Display & text',
    blurb: 'Brightness and text size preview live as you drag; the text size snaps to its marks, and focus hours are a range.',
    components: ['Slider'],
  },
  {
    key: SHOWCASE_SCREEN.signUp,
    title: 'Sign up',
    blurb: 'A birthday on date wheels, a country with flags, interests as chips and the app language.',
    components: ['DatePickerField', 'CountryPicker', 'SelectPicker', 'HorizontalList'],
    recipe: 'birthday',
  },
  {
    key: SHOWCASE_SCREEN.shop,
    title: 'Shop filters',
    blurb: 'Categories that scroll sideways, a size wheel, brands to multi-select and a delivery date.',
    components: ['HorizontalList', 'WheelPickerField', 'SelectPicker', 'DatePickerField'],
    recipe: 'filters-sheet',
  },
  {
    key: SHOWCASE_SCREEN.chat,
    title: 'Chat',
    blurb: 'The emoji button beside Send opens a sheet with search, recents and skin tones, and drops the emoji at the cursor.',
    components: ['EmojiPickerSheet'],
    recipe: 'chat-emoji',
  },
  {
    key: SHOWCASE_SCREEN.send,
    title: 'Send money',
    blurb: 'The amount big and centered, bold on iOS and light in Material, with chips for quick amounts and a pill to switch currency.',
    components: ['AmountField', 'CurrencyPicker', 'HorizontalList'],
  },
  {
    key: SHOWCASE_SCREEN.exchange,
    title: 'Send abroad',
    blurb:
      'Type what you send or what they get and the other side follows, in each currency’s own decimals: none for the yen, three for the dinar.',
    components: ['AmountField', 'CurrencyPicker'],
  },
  {
    key: SHOWCASE_SCREEN.verify,
    title: 'Verify your phone',
    blurb: 'A phone number, then the code texted to it: the keyboard offers it from the message, and a paste fills every box.',
    components: ['PhoneField', 'OtpField'],
  },
  {
    key: SHOWCASE_SCREEN.albums,
    title: 'Photo albums',
    blurb: 'Sort the albums from a menu that ticks the current order, and open each album’s ⋯ sheet to share, rename or delete it.',
    components: ['Menu', 'ActionSheet', 'useActionSheet'],
  },
  {
    key: SHOWCASE_SCREEN.meeting,
    title: 'Meeting invite',
    blurb: 'A date and time in one field, a duration, a time zone and attendees picked as chips.',
    components: ['DateTimePickerField', 'HorizontalList', 'SelectPicker'],
  },
  {
    key: SHOWCASE_SCREEN.delivery,
    title: 'Delivery details',
    blurb:
      'Where to ship, a phone number for the courier that takes the shipping country’s code until you type one, the day and a time window.',
    components: ['CountryPicker', 'PhoneField', 'DatePickerField', 'HorizontalList'],
  },
  {
    key: SHOWCASE_SCREEN.store,
    title: 'New store',
    blurb:
      'Country, state and city that reset each other, opening hours as a time range, a launch sale with its own presets and tags you add from the search.',
    components: ['CountryPicker', 'SelectPicker', 'TimeRangePickerField', 'DatePickerField'],
  },
  {
    key: SHOWCASE_SCREEN.trips,
    title: 'Trip planner',
    blurb: 'Several stays on one calendar, and the cities to visit.',
    components: ['DatePicker', 'SelectPicker'],
  },
  {
    key: SHOWCASE_SCREEN.habit,
    title: 'Habit streak',
    blurb: 'Tap the days you ran on a multi-select calendar, set a daily reminder, and pick the colour that marks your runs.',
    components: ['DatePicker', 'TimePickerField', 'ColorPickerField'],
  },
  {
    key: SHOWCASE_SCREEN.review,
    title: 'Rate your stay',
    blurb: 'Half stars for the stay, a row of stars per category, and the place’s average shown read-only.',
    components: ['Rating'],
  },
  {
    key: SHOWCASE_SCREEN.timer,
    title: 'Interval timer',
    blurb: 'Hours, minutes and seconds on wheels, number boxes or columns, with presets that set them.',
    components: ['DurationPicker', 'HorizontalList'],
    recipe: 'duration',
  },
  {
    key: SHOWCASE_SCREEN.table,
    title: 'Book a table',
    blurb: 'Party size and time slots as chips around a week strip to swipe, which greys out the days the place is closed.',
    components: ['HorizontalList', 'WeekStrip'],
    recipe: 'category-chips',
  },
];

export const TRIP_TYPE = {
  round: 'round',
  oneWay: 'oneWay',
} as const;

export const TRIP_TYPES = [
  { label: 'Round trip', value: TRIP_TYPE.round },
  { label: 'One way', value: TRIP_TYPE.oneWay },
];

/** Inline calendars sit under other fields, so their days are shorter than the default */
export const CALENDAR_DAY_HEIGHT = 40;

export const FLIGHTS = {
  from: 'Lisbon',
  to: 'Tokyo',
  stay: { from: 10, to: 17 },
  day: 10,
  travelers: 2,
  cabin: 'Economy',
};

export const CABINS = labelOptions(['Economy', 'Premium', 'Business', 'First']);

export const TRAVELERS = Array.from({ length: 9 }, (_, i) => ({
  label: i === 0 ? '1 traveler' : `${i + 1} travelers`,
  value: i + 1,
}));

export const TABLE = {
  party: 2,
  day: 2,
  slot: '20:00',
};

export const PARTY_SIZES = Array.from({ length: 8 }, (_, i) => ({
  label: i === 0 ? '1 guest' : `${i + 1} guests`,
  value: i + 1,
}));

export const TABLE_SLOTS = labelOptions(['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']);

/** The restaurant is closed on Mondays */
export const CLOSED_WEEKDAY = 1;

export const ALARM = {
  hours: 7,
  minutes: 30,
  repeat: 'Weekdays',
};

export const REPEAT = labelOptions(['Once', 'Weekdays', 'Weekends', 'Daily']);

export const MEETING = {
  day: 3,
  hours: 10,
  minutes: 30,
  minuteInterval: 15,
  duration: 30,
  people: ['Maya', 'Noam'],
};

export const DURATIONS = [15, 30, 45, 60].map((minutes) => ({
  label: `${minutes} min`,
  value: minutes,
}));

export const TIME_ZONES = labelOptions(['Lisbon · WET', 'New York · EST', 'Tel Aviv · IST', 'Tokyo · JST', 'San Francisco · PST']);

export const PEOPLE = labelOptions(['Maya', 'Noam', 'Lea', 'Omer', 'Yuki', 'Dana', 'Ari']);

export const TIMER_PRESETS: TimerPreset[] = [
  { label: 'Tabata', value: 4 * 60 },
  { label: 'Run', value: 30 * 60 },
  { label: 'Plank', value: 90 },
  { label: 'Long ride', value: 2 * 3600 + 15 * 60 },
];

export const TIMER_PRESET_ITEMS = labelOptions(TIMER_PRESETS.map((p) => p.label));

export const CHAT_CONTACT = {
  name: 'Maya',
  avatar: '🧑‍🍳',
  status: 'online',
};

export const CHAT: ChatMessage[] = [
  { id: 1, text: 'Landed in Lisbon! ☀️', mine: false, time: '6:02 PM' },
  { id: 2, text: 'Amazing! Dinner at 8?', mine: true, time: '6:04 PM' },
  { id: 3, text: 'Booked a table by the river 🍷', mine: false, time: '6:05 PM' },
];

export const CHAT_RECENT = ['😂', '❤️', '👍'];

export const SIGN_UP = {
  birthday: new Date(1994, 4, 12),
  oldestBirthday: new Date(1920, 0, 1),
  country: 'PT' as CountryCode,
  interests: ['Coffee', 'Hiking'],
  maxInterests: 4,
  language: 'English',
};

export const DELIVERY = {
  country: 'PT' as CountryCode,
  phone: '+351912345678',
  day: 2,
  window: '12–15',
};

export const DELIVERY_WINDOWS = labelOptions(['9–12', '12–15', '15–18', '18–21']);

export const INTERESTS = labelOptions(['Hiking', 'Coffee', 'Jazz', 'Design', 'Running', 'Photography', 'Cooking', 'Travel']);

export const LANGUAGES = labelOptions(['English', 'Español', 'Français']);

export const SHOP = {
  category: 'Sneakers',
  size: 'M',
  brands: ['Arc', 'Nord'],
  deliverIn: 4,
  results: 128,
};

export const SHOP_CATEGORIES = labelOptions(['All', 'Sneakers', 'Jackets', 'Bags', 'Hats', 'Socks', 'Watches']);

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const BRANDS = labelOptions(['Arc', 'Fjord', 'Kōen', 'Mesa', 'Nord', 'Tide', 'Verde']);

export const HABIT = {
  ranDaysAgo: [1, 2, 4, 5, 7, 9, 10, 12],
  color: '#4CAF50',
  colors: [
    { value: '#4CAF50', label: 'Green' },
    { value: '#2196F3', label: 'Blue' },
    { value: '#9C27B0', label: 'Purple' },
    { value: '#E91E63', label: 'Pink' },
    { value: '#FF9800', label: 'Orange' },
    { value: '#795548', label: 'Brown' },
  ],
  reminder: { hours: 6, minutes: 45 },
  minuteInterval: 5,
};

export const TRIPS = {
  stays: [
    [3, 6],
    [12, 16],
  ] as const,
  cities: ['Lisbon', 'Paris'],
};

export const DISPLAY = {
  brightness: 70,
  textSize: 17,
  focus: [9, 17] as [number, number],
};

/** Text sizes in points, like iOS's Larger Text slider: only these can be picked. */
export const TEXT_SIZES = [
  { value: 13, label: 'XS' },
  { value: 15, label: 'S' },
  { value: 17, label: 'M' },
  { value: 20, label: 'L' },
  { value: 24, label: 'XL' },
];
export const TEXT_SIZE_RANGE = { min: 13, max: 24 };

export const HOURS_IN_DAY = 24;
/** Every six hours, labelled under the focus-hours track. */
export const FOCUS_MARKS = [
  { value: 0, label: '12a' },
  { value: 6, label: '6a' },
  { value: 12, label: 'Noon' },
  { value: 18, label: '6p' },
  { value: 24, label: '12a' },
];

/** The preview is never fully dark, so it stays readable at the lowest brightness. */
export const MIN_PREVIEW_OPACITY = 0.3;

export const VERIFY = {
  phone: '+12015550123',
  codeLength: 6,
} as const;

export const REVIEW = {
  place: 'Casa do Mar',
  city: 'Lisbon',
  average: 4.6,
  reviews: 312,
} as const;
export const REVIEW_CATEGORIES = ['Cleanliness', 'Location', 'Value'] as const;

export const ALBUMS: Album[] = [
  { name: 'Summer in Lisbon', emoji: '🌊', photos: 214 },
  { name: 'Maya’s birthday', emoji: '🎂', photos: 86 },
  { name: 'Hiking the Alps', emoji: '🏔️', photos: 152 },
  { name: 'Recipes', emoji: '🍝', photos: 37 },
];

export const ALBUM_SORT = {
  recent: 'Recently added',
  name: 'Name',
  photos: 'Most photos',
} as const;

export const ALBUM_SORTS = Object.values(ALBUM_SORT);

export const APPLICATION = {
  minSkills: 2,
  maxSkills: 4,
  /** Days from today: interviews from tomorrow, a first day from next week */
  firstInterviewDay: 1,
  firstStartDay: 7,
  minuteInterval: 30,
} as const;

export const EMPTY_APPLICATION: ApplicationValues = {
  role: null,
  country: null,
  phone: '',
  phoneValid: false,
  startDate: null,
  skills: [],
};

export const ROLES = labelOptions(['Frontend engineer', 'Mobile engineer', 'Product designer', 'Data analyst']);

export const SKILLS = labelOptions(['React Native', 'TypeScript', 'Design systems', 'Accessibility', 'Testing', 'Animation']);

export const APPLICATION_ERRORS = {
  role: 'Choose the role you’re applying for',
  country: 'Choose where you live',
  phone: 'Enter a phone number',
  phoneIncomplete: 'Enter the full number',
  startDate: 'Choose when you can start',
  interview: 'Choose an interview slot',
  interviewAfterStart: 'Pick an interview before your first day',
  skills: `Pick at least ${APPLICATION.minSkills} skills`,
} as const;

export const STORE_COUNTRIES: CountryCode[] = ['US', 'CA', 'AU'];

export const STORE_STATES: Partial<Record<CountryCode, string[]>> = {
  US: ['California', 'New York', 'Texas'],
  CA: ['Ontario', 'Quebec', 'British Columbia'],
  AU: ['New South Wales', 'Victoria', 'Queensland'],
};

export const STORE_CITIES: Record<string, string[]> = {
  California: ['Los Angeles', 'San Francisco', 'San Diego'],
  'New York': ['New York City', 'Buffalo', 'Albany'],
  Texas: ['Austin', 'Houston', 'Dallas'],
  Ontario: ['Toronto', 'Ottawa', 'Hamilton'],
  Quebec: ['Montreal', 'Quebec City', 'Laval'],
  'British Columbia': ['Vancouver', 'Victoria', 'Kelowna'],
  'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
  Victoria: ['Melbourne', 'Geelong', 'Ballarat'],
  Queensland: ['Brisbane', 'Gold Coast', 'Cairns'],
};

export const STORE = {
  country: 'US' as CountryCode,
  opens: 9,
  closes: 18,
  minuteInterval: 30,
  /** Shortest opening, in minutes */
  minDuration: 60,
  tags: ['Coffee', 'Pastries'],
};

export const STORE_TAGS = ['Coffee', 'Pastries', 'Vegan', 'Wi-Fi', 'Outdoor seating', 'Pet friendly'];

/** The launch sale's presets, in days from today */
export const LAUNCH_PRESETS = [
  { label: 'Opening weekend', from: 5, to: 6 },
  { label: 'First week', from: 0, to: 6 },
  { label: 'First month', from: 0, to: 29 },
];

export const SEND = {
  amount: 25,
  currency: 'USD' as CurrencyCode,
  preferred: ['USD', 'EUR', 'GBP', 'ILS'] as CurrencyCode[],
};

export const QUICK_AMOUNTS = [10, 25, 50, 100];

/** Made up for the demo: units of each currency per US dollar. */
export const RATES: Partial<Record<CurrencyCode, number>> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  ILS: 3.7,
  JPY: 151,
  INR: 83,
  CAD: 1.36,
  KWD: 0.31,
};

export const EXCHANGE_CURRENCIES = Object.keys(RATES) as CurrencyCode[];

export const EXCHANGE_SIDE = {
  send: 'send',
  receive: 'receive',
} as const;

export const EXCHANGE = {
  amount: 1000,
  from: 'USD' as CurrencyCode,
  to: 'EUR' as CurrencyCode,
};

/** Significant digits of the rate line: 0.92, 151, 0.002053 */
export const RATE_PRECISION = 4;
