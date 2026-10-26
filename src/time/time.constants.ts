export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 3600;
export const NOON_SECONDS = 12 * SECONDS_PER_HOUR;
export const LAST_SECOND_OF_DAY = 24 * SECONDS_PER_HOUR - 1;

export const DEFAULT_TIME_SEPARATOR = ':';

export const TIME_FORMAT = {
  twelveHour: '12h',
  twentyFourHour: '24h',
  auto: 'auto',
} as const;

export const TIME_COLUMN = {
  period: 'period',
  hour: 'hour',
  minute: 'minute',
  second: 'second',
} as const;
