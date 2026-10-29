import {
  buildTimeZoneOptions,
  formatGmtOffset,
  getAllTimeZones,
  getTimeZone,
  getTimeZoneName,
  getTimeZoneOffset,
  normalizeTimeZone,
  normalizeTimeZoneValue,
} from './timezone.utils';

const WINTER = new Date(Date.UTC(2026, 0, 15, 12));
const SUMMER = new Date(Date.UTC(2026, 6, 15, 12));

describe('time zone data', () => {
  it('lists every zone once, by its current IANA name', () => {
    const all = getAllTimeZones();
    expect(all.length).toBeGreaterThan(400);
    expect(new Set(all.map((z) => z.id)).size).toBe(all.length);
    expect(all.find((z) => z.id === 'Asia/Calcutta')).toBeUndefined();
  });

  it('names the city, with the state or country for three-part names', () => {
    expect(getTimeZone('Europe/Lisbon')).toEqual({ id: 'Europe/Lisbon', alias: undefined, city: 'Lisbon', region: 'Europe' });
    expect(getTimeZone('America/Argentina/Salta')?.city).toBe('Salta, Argentina');
    expect(getTimeZone('Asia/Ho_Chi_Minh')?.city).toBe('Ho Chi Minh');
  });

  it('maps older names to current ones', () => {
    expect(normalizeTimeZone('Asia/Calcutta')).toBe('Asia/Kolkata');
    expect(normalizeTimeZone('Europe/Kiev')).toBe('Europe/Kyiv');
    expect(normalizeTimeZone('Europe/Lisbon')).toBe('Europe/Lisbon');
    expect(normalizeTimeZone('Mars/Olympus')).toBe('Mars/Olympus');
    expect(normalizeTimeZoneValue({ value: 'Asia/Saigon' }).value).toBe('Asia/Ho_Chi_Minh');
    expect(normalizeTimeZoneValue({ multiple: true, value: ['Asia/Calcutta'] }).value).toEqual(['Asia/Kolkata']);
  });
});

describe('offsets', () => {
  it('works out the offset at a moment, daylight saving included', () => {
    expect(getTimeZoneOffset('Europe/Lisbon', WINTER)).toBe(0);
    expect(getTimeZoneOffset('Europe/Lisbon', SUMMER)).toBe(60);
    expect(getTimeZoneOffset('America/New_York', WINTER)).toBe(-300);
    expect(getTimeZoneOffset('Asia/Kolkata', WINTER)).toBe(330);
    expect(getTimeZoneOffset('Asia/Kolkata', new Date(Date.UTC(2026, 0, 15, 12, 0, 45, 500)))).toBe(330);
    expect(getTimeZoneOffset('Mars/Olympus', WINTER)).toBeNull();
  });

  it('writes offsets as iOS and Android do', () => {
    expect(formatGmtOffset(0)).toBe('GMT');
    expect(formatGmtOffset(60)).toBe('GMT+1');
    expect(formatGmtOffset(-300)).toBe('GMT-5');
    expect(formatGmtOffset(330)).toBe('GMT+5:30');
    expect(formatGmtOffset(-570)).toBe('GMT-9:30');
  });

  it('names the zone where the engine can', () => {
    expect(getTimeZoneName('Europe/Lisbon', 'en', WINTER)).toBe('Western European Standard Time');
  });
});

describe('buildTimeZoneOptions', () => {
  const ZONES = ['America/New_York', 'Asia/Kolkata', 'Europe/Lisbon', 'Europe/Paris'];

  it('sorts by offset, and shows the offset and name', () => {
    const options = buildTimeZoneOptions({ timeZones: ZONES, preferred: [], locale: 'en', date: WINTER });
    expect(options.map((o) => o.label)).toEqual(['New York', 'Lisbon', 'Paris', 'Kolkata']);
    expect(options[1]?.description).toBe('GMT · Western European Standard Time');
    expect(options[1]?.keywords).toEqual(expect.arrayContaining(['Europe/Lisbon', 'UTC', 'Europe']));
  });

  it('pins the preferred zone on top, by any of its names', () => {
    const options = buildTimeZoneOptions({ timeZones: ZONES, preferred: ['Asia/Calcutta'], locale: 'en', date: WINTER });
    expect(options[0]).toMatchObject({ value: 'Asia/Kolkata', group: 'Your time zone' });
    expect(options[1]?.group).toBe('All time zones');
  });
});
