import { toDateKey } from '@elik56a/react-native-pickers';
import { PRICE_DAYS, WEEKDAY_PRICE, WEEKEND_PRICE } from './demo.constants';
import {
  ADULT_ITEMS,
  bookedNights,
  buildPrices,
  CHILD_ITEMS,
  daysFromNow,
  daysFromNowAt,
  deviceSheetProps,
  guestColumns,
  guestsLabel,
  labelOptions,
  nightlyPrice,
  nightsTotal,
  plural,
  stay,
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

const keys = (nights: Date[]) => nights.map(toDateKey);

describe('bookedNights', () => {
  it('books every night of a stay up to the night before check-out', () => {
    expect(keys(bookedNights(stay(2, 5)))).toEqual([2, 3, 4].map((d) => toDateKey(daysFromNow(d))));
  });

  it('books one night per day picked, and every night of each stay', () => {
    expect(bookedNights(daysFromNow(3))).toHaveLength(1);
    expect(keys(bookedNights([daysFromNow(1), daysFromNow(6)]))).toEqual([1, 6].map((d) => toDateKey(daysFromNow(d))));
    expect(bookedNights([stay(1, 3), stay(8, 9)])).toHaveLength(3);
  });

  it('books nothing until a stay has both ends', () => {
    expect(bookedNights(null)).toEqual([]);
    expect(bookedNights({ start: daysFromNow(2), end: null })).toEqual([]);
  });
});

describe('nightsTotal', () => {
  it('adds up the price of each night', () => {
    expect(nightsTotal(bookedNights(stay(2, 5)))).toBe(nightlyPrice(2) + nightlyPrice(3) + nightlyPrice(4));
    expect(nightsTotal([])).toBe(0);
  });
});

describe('guestsLabel', () => {
  it('counts adults, and children only when there are some', () => {
    expect(guestsLabel({ adults: 1, children: 0 })).toBe('1 adult');
    expect(guestsLabel({ adults: 2, children: 1 })).toBe('2 adults, 1 child');
    expect(guestsLabel({ adults: 2, children: 3 })).toBe('2 adults, 3 children');
  });
});

describe('guest wheel items', () => {
  it('labels every count', () => {
    expect(ADULT_ITEMS[0]).toEqual({ label: '1 adult', value: 1 });
    expect(CHILD_ITEMS.slice(0, 2)).toEqual([
      { label: '0 children', value: 0 },
      { label: '1 child', value: 1 },
    ]);
  });
});

describe('guestColumns', () => {
  it('changes one count and keeps the other', () => {
    const onChange = jest.fn();
    const [adults, children] = guestColumns({ adults: 2, children: 1 }, onChange, true);
    expect([adults.value, children.value, adults.loop]).toEqual([2, 1, true]);
    adults.onChange?.(3, 2);
    expect(onChange).toHaveBeenLastCalledWith({ adults: 3, children: 1 });
    children.onChange?.(0, 0);
    expect(onChange).toHaveBeenLastCalledWith({ adults: 2, children: 0 });
  });
});

describe('deviceSheetProps', () => {
  it('clears the home indicator and stops under the status bar', () => {
    expect(deviceSheetProps('ios', 700, 1000)).toEqual({ bottomInset: 30, draggable: true, expandedHeight: 648, maxHeightRatio: 0.648 });
    expect(deviceSheetProps('android').expandedHeight).toBeUndefined();
    expect(deviceSheetProps('android').bottomInset).toBe(16);
  });

  it('caps the sheet at the phone screen, not the taller browser window', () => {
    expect(deviceSheetProps('android', 600, 900).maxHeightRatio).toBeCloseTo(548 / 900);
    expect(deviceSheetProps('ios', 900, 600).maxHeightRatio).toBe(1);
    expect(deviceSheetProps('ios', undefined, 900).maxHeightRatio).toBeUndefined();
  });
});

describe('daysFromNowAt', () => {
  it('sets the time on a day ahead', () => {
    const date = daysFromNowAt(3, 10, 30);
    expect(toDateKey(date)).toBe(toDateKey(daysFromNow(3)));
    expect([date.getHours(), date.getMinutes()]).toEqual([10, 30]);
  });
});

describe('plural', () => {
  it('pluralizes past one', () => {
    expect(plural(1, 'day')).toBe('1 day');
    expect(plural(3, 'day')).toBe('3 days');
    expect(plural(2, 'city', 'cities')).toBe('2 cities');
  });
});

describe('labelOptions', () => {
  it('uses each label as its value', () => {
    expect(labelOptions(['S', 'M'])).toEqual([
      { label: 'S', value: 'S' },
      { label: 'M', value: 'M' },
    ]);
  });
});
