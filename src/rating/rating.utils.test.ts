import { formatRating, getFills, isOnStars, ratingAt, stepRating } from './rating.utils';

const stars = {
  size: 30,
  gap: 10,
  max: 5,
  step: 1,
};

describe('ratingAt', () => {
  it('picks the star under the touch, and at least one', () => {
    expect(ratingAt(0, stars)).toBe(1);
    expect(ratingAt(15, stars)).toBe(1);
    expect(ratingAt(45, stars)).toBe(2);
    expect(ratingAt(500, stars)).toBe(5);
  });

  it('counts the gap after a star as that star', () => {
    expect(ratingAt(35, stars)).toBe(1);
  });

  it('fills half a star with half steps', () => {
    const halves = { ...stars, step: 0.5 };
    expect(ratingAt(50, halves)).toBe(1.5);
    expect(ratingAt(65, halves)).toBe(2);
    expect(ratingAt(2, halves)).toBe(0.5);
  });
});

describe('isOnStars', () => {
  it('ends at the last star, without the gap after it', () => {
    expect(isOnStars(190, stars)).toBe(true);
    expect(isOnStars(191, stars)).toBe(false);
  });
});

describe('stepRating', () => {
  it('moves a step and stays between 0 and max', () => {
    expect(stepRating(3, 1, 1, 5)).toBe(4);
    expect(stepRating(5, 1, 1, 5)).toBe(5);
    expect(stepRating(0, -1, 1, 5)).toBe(0);
    expect(stepRating(2.5, -1, 0.5, 5)).toBe(2);
  });

  it('lands on the step grid from a value between steps', () => {
    expect(stepRating(3.3, 1, 1, 5)).toBe(4);
    expect(stepRating(3.3, -1, 1, 5)).toBe(3);
  });
});

describe('getFills', () => {
  it('fills each star up to the value', () => {
    expect(getFills(3.5, 5)).toEqual([1, 1, 1, 0.5, 0]);
    expect(getFills(0, 3)).toEqual([0, 0, 0]);
  });
});

describe('formatRating', () => {
  it('reads the value out of max', () => {
    expect(formatRating(4, 5)).toBe('4 of 5');
    expect(formatRating(4.333, 5)).toBe('4.33 of 5');
  });
});
