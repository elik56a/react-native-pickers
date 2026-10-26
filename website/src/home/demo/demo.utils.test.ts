import { toDateKey } from '@elik56a/react-native-pickers';
import { DEFAULT_OPTIONS } from '../playground/playground.constants';
import { PRICE_DAYS, WEEKDAY_PRICE, WEEKEND_PRICE } from './demo.constants';
import { buildPrices, daysFromNow, demoSubtitle, stay } from './demo.utils';

describe('stay', () => {
  it('spans whole local days from today', () => {
    const { start, end } = stay(1, 4);
    expect(start?.getHours()).toBe(0);
    expect(start && toDateKey(start)).toBe(toDateKey(daysFromNow(1)));
    expect(end && toDateKey(end)).toBe(toDateKey(daysFromNow(4)));
  });
});

describe('buildPrices', () => {
  it('prices every day ahead, with Friday and Saturday nights costing more', () => {
    const prices = buildPrices();
    expect(Object.keys(prices)).toHaveLength(PRICE_DAYS);
    for (let i = 0; i < 7; i++) {
      const day = daysFromNow(i);
      const price = Number(prices[toDateKey(day)]?.label?.slice(1));
      const weekend = day.getDay() === 5 || day.getDay() === 6;
      expect(price).toBeGreaterThanOrEqual(weekend ? WEEKEND_PRICE : WEEKDAY_PRICE);
      expect(price).toBeLessThan((weekend ? WEEKEND_PRICE : WEEKDAY_PRICE) + 30);
    }
  });
});

describe('demoSubtitle', () => {
  it('describes the props picked for the shown tab', () => {
    expect(demoSubtitle('date', DEFAULT_OPTIONS)).toBe('Tap check-in, then check-out · nightly prices');
    expect(demoSubtitle('time', { ...DEFAULT_OPTIONS, time: { format: '24h', minuteInterval: 15, showSeconds: false } })).toBe(
      '15-minute steps, 24h clock'
    );
    expect(demoSubtitle('wheel', { ...DEFAULT_OPTIONS, wheel: { variant: 'flat', loop: false, visibleItems: 5 } })).toBe(
      'Bounded flat wheel'
    );
  });
});
