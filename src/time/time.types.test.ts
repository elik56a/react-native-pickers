import type { TimeColumnsOptions, TimeOptions } from './time.types';

// Type-level regression test: `pnpm typecheck` fails this file if TimeOptions starts accepting the visual or value props.
const options = (props: TimeOptions) => props;
const columnsOptions = (props: TimeColumnsOptions) => props;

describe('TimeOptions', () => {
  it('takes the wheel options but not the visual or value props', () => {
    options({ format: '24h', minuteInterval: 5, showSeconds: true, minTime: new Date(), testID: 'time' });
    // @ts-expect-error visual props belong to the picker, not the wheel options
    options({ itemHeight: 40 });
    // @ts-expect-error the value comes from TimeColumnsOptions.date
    options({ value: new Date() });
    expect(options({ loop: false }).loop).toBe(false);
  });

  it('needs a date and a change handler for the columns', () => {
    const date = new Date();
    expect(columnsOptions({ date, onChange: () => {} }).date).toBe(date);
    // @ts-expect-error onChange is required
    columnsOptions({ date });
  });
});
