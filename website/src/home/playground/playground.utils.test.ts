import { ACCENTS, CONTROLS, DEFAULT_OPTIONS } from './playground.constants';
import { buildSnippet, jsxProp, valueLabel } from './playground.utils';

describe('jsxProp', () => {
  it('writes true as a bare name, strings quoted and other values in braces', () => {
    expect(jsxProp('loop', true)).toBe('loop');
    expect(jsxProp('mode', 'range')).toBe('mode="range"');
    expect(jsxProp('columns', 7)).toBe('columns={7}');
    expect(jsxProp('showSkinTones', false)).toBe('showSkinTones={false}');
  });
});

describe('buildSnippet', () => {
  it('names the state after the date mode and leaves default props out', () => {
    expect(buildSnippet('date', { mode: 'single', prices: false, firstDayOfWeek: 0 })).toBe(
      `import { DatePickerField } from '@elik56a/react-native-pickers';

<DatePickerField
  label="Dates"
  value={date}
  onConfirm={setDate}
  minDate={new Date()}
/>`
    );
    expect(buildSnippet('date', { mode: 'ranges', prices: true, firstDayOfWeek: 1 })).toContain(
      'mode="ranges"\n  value={ranges}\n  onConfirm={setRanges}\n  minDate={new Date()}\n  markedDates={prices}\n  firstDayOfWeek={1}'
    );
  });

  it('only writes the props a visitor changed from the defaults', () => {
    expect(buildSnippet('time', { format: 'auto', minuteInterval: 1, showSeconds: false })).not.toContain('format');
    expect(buildSnippet('time', { format: '24h', minuteInterval: 15, showSeconds: true })).toContain(
      'format="24h"\n  minuteInterval={15}\n  showSeconds'
    );
    expect(buildSnippet('emoji', { columns: 8, showSkinTones: true, categoryBarPosition: 'top' })).toContain(
      '<EmojiPickerField\n  label="Vibe"\n  value={vibe}\n  onSelect={setVibe}\n/>'
    );
  });

  it('writes the country props a visitor turned on, and no locale for the device one', () => {
    expect(buildSnippet('country', { preferred: false, showDialCode: false, locale: 'auto' })).toContain(
      '<CountryPicker\n  label="Country"\n  value={country}\n  onChange={setCountry}\n/>'
    );
    expect(buildSnippet('country', { preferred: true, showDialCode: true, locale: 'de' })).toContain(
      "preferred={['US', 'GB', 'DE']}\n  showDialCode\n  locale=\"de\""
    );
  });

  it('switches select state and data with the multiple and groups toggles', () => {
    const single = buildSnippet('select', { multiple: false, searchable: false, groups: false, loading: true });
    expect(single).toContain('options={CITIES}\n  value={city}\n  onChange={setCity}\n  searchable={false}\n  loading');
    expect(buildSnippet('select', { ...DEFAULT_OPTIONS.select, multiple: true })).toContain(
      'options={CITIES_BY_REGION}\n  value={cities}\n  onChange={setCities}\n  multiple'
    );
  });

  it('puts loop on each guests wheel, since it belongs to a column', () => {
    expect(buildSnippet('wheel', { variant: 'flat', loop: true, visibleItems: 7 })).toContain(
      'columns={[{ ...adults, loop: true }, { ...children, loop: true }]}\n  variant="flat"\n  visibleItems={7}'
    );
  });

  it('wraps the picker in a themed provider for a custom accent', () => {
    const blue = ACCENTS.find((a) => a.key === 'blue');
    const code = buildSnippet('wheel', DEFAULT_OPTIONS.wheel, blue);
    expect(code.split('\n')[0]).toBe("import { MultiWheelPicker, PickersProvider } from '@elik56a/react-native-pickers';");
    expect(code).toContain("theme={{ colors: { primary: '#2563EB', primaryMuted: 'rgba(37,99,235,0.12)' } }}");
    expect(code).toContain("darkTheme={{ colors: { primary: '#60A5FA', primaryMuted: 'rgba(96,165,250,0.18)' } }}");
    expect(code).toContain('  <MultiWheelPicker\n    columns={[adults, children]}');
    expect(code.endsWith('</PickersProvider>')).toBe(true);
  });
});

describe('valueLabel', () => {
  it('uses the control labels when it has them and the value otherwise', () => {
    expect(valueLabel(CONTROLS.date[2], 1)).toBe('Mon');
    expect(valueLabel(CONTROLS.time[1], 15)).toBe('15');
  });
});
