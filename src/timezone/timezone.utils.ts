import type { Locale } from '../core';
import { getCompare, safe } from '../core/utils/intl.utils';
import type { SelectOption } from '../select';
import { pinPreferred } from '../select/select.utils';
import { RAW_TIME_ZONE_DATA } from './data';
import { DEFAULT_ALL_TIME_ZONES_LABEL, DEFAULT_CURRENT_TIME_ZONE_LABEL, GMT, MINUTES_PER_HOUR, MS_PER_MINUTE } from './timezone.constants';
import type { TimeZone, TimeZoneListOptions } from './timezone.types';

let cache: TimeZone[] | null = null;
let byName: Map<string, TimeZone> | null = null;
const offsetFormats = new Map<string, Intl.DateTimeFormat | null>();
const nameFormats = new Map<string, Intl.DateTimeFormat | null>();

/** 'America/Argentina/Salta' → 'Salta, Argentina'; underscores are spaces. */
const toCity = (parts: string[]) => {
  const words = parts.slice(1).map((part) => part.replace(/_/g, ' '));
  return words.length > 1 ? `${words[words.length - 1]}, ${words.slice(0, -1).join(', ')}` : (words[0] ?? '');
};

const parseLine = (line: string): TimeZone => {
  const [id = '', alias] = line.split('\t');
  const parts = id.split('/');
  return {
    id,
    alias: alias || undefined,
    city: toCity(parts),
    region: parts[0] ?? '',
  };
};

/** Every IANA time zone, sorted by name, parsed on first use. */
export const getAllTimeZones = (): TimeZone[] => {
  cache ??= RAW_TIME_ZONE_DATA.split('\n').map(parseLine);
  return cache;
};

/** Look a zone up by its current or older IANA name. */
export const getTimeZone = (id: string): TimeZone | undefined => {
  byName ??= new Map(getAllTimeZones().flatMap((zone) => [[zone.id, zone], ...(zone.alias ? [[zone.alias, zone] as const] : [])]));
  return byName.get(id);
};

/** The current IANA name for `id`: 'Asia/Calcutta' → 'Asia/Kolkata'. Unknown names come back as they are. */
export const normalizeTimeZone = (id: string) => getTimeZone(id)?.id ?? id;

/** The device's time zone, by its current IANA name, or undefined where the engine doesn't say. */
export const getDeviceTimeZone = () => {
  const id = safe(() => Intl.DateTimeFormat().resolvedOptions().timeZone, '');
  return id ? normalizeTimeZone(id) : undefined;
};

/** A formatter for the zone, by its current name or, on engines that only know that, its older one. */
const formatterFor = (
  cacheMap: Map<string, Intl.DateTimeFormat | null>,
  key: string,
  zone: TimeZone,
  make: (id: string) => Intl.DateTimeFormat
) => {
  if (!cacheMap.has(key)) {
    const names = [zone.id, ...(zone.alias ? [zone.alias] : [])];
    cacheMap.set(
      key,
      names.reduce<Intl.DateTimeFormat | null>((found, id) => found ?? safe(() => make(id), null), null)
    );
  }
  return cacheMap.get(key) ?? null;
};

/** Minutes ahead of UTC at `date` (daylight saving included), or null where the engine can't tell. */
export const getTimeZoneOffset = (id: string, date = new Date()): number | null => {
  const zone = getTimeZone(id);
  if (!zone) return null;
  const format = formatterFor(
    offsetFormats,
    zone.id,
    zone,
    (name) =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: name,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
  );
  return safe(() => {
    if (!format) return null;
    // The wall time has no seconds, so compare it with the moment cut to its minute.
    const minute = Math.floor(date.getTime() / MS_PER_MINUTE) * MS_PER_MINUTE;
    const part = Object.fromEntries(format.formatToParts(minute).map((p) => [p.type, Number(p.value)]));
    const wall = Date.UTC(part.year ?? 0, (part.month ?? 1) - 1, part.day ?? 1, part.hour ?? 0, part.minute ?? 0);
    return (wall - minute) / MS_PER_MINUTE;
  }, null);
};

/** 'GMT', 'GMT+1', 'GMT-3', 'GMT+5:30': how iOS and Android write an offset. */
export const formatGmtOffset = (minutes: number) => {
  if (minutes === 0) return GMT;
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / MINUTES_PER_HOUR);
  const rest = abs % MINUTES_PER_HOUR;
  return `${GMT}${minutes < 0 ? '-' : '+'}${hours}${rest ? `:${String(rest).padStart(2, '0')}` : ''}`;
};

/** The zone's name in `locale`, e.g. 'Central European Summer Time', where the engine has it. */
export const getTimeZoneName = (id: string, locale?: Locale, date = new Date()) => {
  const zone = getTimeZone(id);
  if (!zone) return undefined;
  const format = formatterFor(
    nameFormats,
    `${locale ?? ''}|${zone.id}`,
    zone,
    (name) => new Intl.DateTimeFormat(locale, { timeZone: name, timeZoneName: 'long' })
  );
  const name = safe(() => format?.formatToParts(date).find((p) => p.type === 'timeZoneName')?.value, '');
  // Engines without names answer with an offset instead.
  return name && !name.startsWith(GMT) ? name : undefined;
};

/**
 * The zones as select options, sorted by offset then city: `preferred` (the device's zone by default) first under its own
 * header. Each shows its offset and name; search also matches the IANA name, region and `UTC` offsets.
 */
export const buildTimeZoneOptions = ({
  timeZones,
  preferred,
  preferredLabel = DEFAULT_CURRENT_TIME_ZONE_LABEL,
  allTimeZonesLabel = DEFAULT_ALL_TIME_ZONES_LABEL,
  locale,
  date = new Date(),
}: TimeZoneListOptions): SelectOption<string>[] => {
  const pool = timeZones ? timeZones.flatMap((id) => getTimeZone(id) ?? []) : getAllTimeZones();
  const pinnedIds = preferred ?? [getDeviceTimeZone()].flatMap((id) => id ?? []);
  const { pinned, rest } = pinPreferred(pool, pinnedIds.map(normalizeTimeZone), (zone) => zone.id);
  const toOption = (zone: TimeZone, group?: string): SelectOption<string> & { offset: number } => {
    const offset = getTimeZoneOffset(zone.id, date) ?? 0;
    const gmt = formatGmtOffset(offset);
    const name = getTimeZoneName(zone.id, locale, date);
    return {
      label: zone.city,
      value: zone.id,
      description: `${gmt} · ${name ?? zone.region}`,
      group,
      keywords: [zone.id, zone.alias ?? '', zone.region, gmt, gmt.replace(GMT, 'UTC'), name ?? ''],
      offset,
    };
  };
  const compare = getCompare(locale);
  const others = rest
    .map((zone) => toOption(zone, pinned.length ? allTimeZonesLabel : undefined))
    .sort((a, b) => a.offset - b.offset || compare(a.label, b.label));
  return [...pinned.map((zone) => toOption(zone, preferredLabel)), ...others].map(({ offset: _offset, ...option }) => option);
};

/** The picker's props with `value` in current IANA names, so a device's 'Asia/Calcutta' finds 'Asia/Kolkata'. */
export const normalizeTimeZoneValue = <P extends { multiple?: boolean; value?: string | string[] | null }>(props: P): P => {
  const { value } = props;
  if (value == null) return props;
  return {
    ...props,
    value: Array.isArray(value) ? value.map(normalizeTimeZone) : normalizeTimeZone(value),
  };
};
