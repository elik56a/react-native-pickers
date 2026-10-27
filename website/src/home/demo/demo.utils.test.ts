import { toDateKey } from '@elik56a/react-native-pickers';
import { DEFAULT_OPTIONS } from '../playground/playground.constants';
import { PRICE_DAYS, WEEKDAY_PRICE, WEEKEND_PRICE } from './demo.constants';
import {
  buildPrices,
  daysFromNow,
  demoSubtitle,
  deviceSheetProps,
  guestsLabel,
  nightlyPrice,
  stay,
  stayNights,
  stayTotal,
} from './demo.utils';

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

describe('stayTotal', () => {
  it('adds up the nights from check-in to the night before check-out', () => {
    expect(stayNights(stay(2, 5))).toBe(3);
    expect(stayTotal(stay(2, 5))).toBe(nightlyPrice(2) + nightlyPrice(3) + nightlyPrice(4));
  });

  it('is nothing until both ends are picked', () => {
    const open = { start: daysFromNow(2), end: null };
    expect(stayNights(open)).toBe(0);
    expect(stayTotal(open)).toBe(0);
  });
});

describe('guestsLabel', () => {
  it('counts adults, and children only when there are some', () => {
    expect(guestsLabel({ adults: 1, children: 0 })).toBe('1 adult');
    expect(guestsLabel({ adults: 2, children: 1 })).toBe('2 adults, 1 child');
    expect(guestsLabel({ adults: 2, children: 3 })).toBe('2 adults, 3 children');
  });
});

describe('deviceSheetProps', () => {
  it('clears the home indicator and stops under the status bar', () => {
    expect(deviceSheetProps('ios', 700)).toEqual({ bottomInset: 30, draggable: true, expandedHeight: 648 });
    expect(deviceSheetProps('android').expandedHeight).toBeUndefined();
    expect(deviceSheetProps('android').bottomInset).toBe(16);
  });
});
