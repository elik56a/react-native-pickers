import {
  formatSliderValue,
  fractionToValue,
  getHaloLevel,
  getKeyStep,
  getMarkLabels,
  getMarks,
  getThumbOffset,
  getTrackSegments,
  moveThumb,
  nearestMark,
  nearestThumb,
  normalizeMarks,
  sameValues,
  snapValue,
  stepToMark,
  toThumbValues,
  valueToFraction,
} from './slider.utils';

describe('snapValue', () => {
  it('snaps to the nearest step from min and stays in range', () => {
    expect(snapValue(7, 0, 100, 5)).toBe(5);
    expect(snapValue(8, 0, 100, 5)).toBe(10);
    expect(snapValue(3, 1, 11, 2)).toBe(3);
    expect(snapValue(120, 0, 100, 5)).toBe(100);
    expect(snapValue(-3, 0, 100, 5)).toBe(0);
  });

  it('keeps decimal steps free of float noise, and continuous values as they are', () => {
    expect(snapValue(0.30000000000000004, 0, 1, 0.1)).toBe(0.3);
    expect(snapValue(0.123, 0, 1, 0)).toBe(0.12);
  });
});

describe('fractions', () => {
  it('maps values to fractions and back, snapped', () => {
    expect(valueToFraction(25, 0, 100)).toBe(0.25);
    expect(valueToFraction(5, 5, 5)).toBe(0);
    expect(fractionToValue(0.26, 0, 100, 5)).toBe(25);
    expect(fractionToValue(1, -50, 50, 1)).toBe(50);
  });

  it('places a thumb inset from the ends', () => {
    expect(getThumbOffset(0, 200, 14)).toBe(14);
    expect(getThumbOffset(1, 200, 14)).toBe(186);
    expect(getThumbOffset(0.5, 200, 14)).toBe(100);
  });

  it('steps a key by one step, or a hundredth of a continuous range', () => {
    expect(getKeyStep(0, 100, 5)).toBe(5);
    expect(getKeyStep(0, 200, 0)).toBe(2);
  });
});

describe('thumbs', () => {
  it('grabs the nearest thumb, and of stacked ones the one on the touch side', () => {
    expect(nearestThumb([0.2, 0.8], 0.3)).toBe(0);
    expect(nearestThumb([0.2, 0.8], 0.7)).toBe(1);
    expect(nearestThumb([0.5, 0.5], 0.4)).toBe(0);
    expect(nearestThumb([0.5, 0.5], 0.6)).toBe(1);
    expect(nearestThumb([1, 1], 1)).toBe(1);
  });

  it('keeps a range in order as a thumb moves', () => {
    expect(moveThumb([20, 60], 0, 80)).toEqual([60, 60]);
    expect(moveThumb([20, 60], 1, 10)).toEqual([20, 20]);
    expect(moveThumb([20, 60], 1, 70)).toEqual([20, 70]);
    expect(moveThumb([20], 0, 90)).toEqual([90]);
  });

  it('reads a value or range in order and in range', () => {
    expect(toThumbValues(150, 0, 100)).toEqual([100]);
    expect(toThumbValues([80, 10], 0, 100)).toEqual([10, 80]);
    expect(sameValues([1, 2], [1, 2])).toBe(true);
    expect(sameValues([1, 2], [1, 3])).toBe(false);
  });

  it('formats with the step’s decimals', () => {
    expect(formatSliderValue(40, 1)).toBe('40');
    expect(formatSliderValue(0.25, 0.05)).toBe('0.25');
    expect(formatSliderValue(0.3333, 0)).toBe('0.33');
  });
});

describe('getTrackSegments', () => {
  it('is active from the start to a single thumb', () => {
    expect(getTrackSegments(200, [50], false, 0)).toEqual([
      { key: '0', start: 0, end: 50, active: true, outerStart: true, outerEnd: false },
      { key: '1', start: 50, end: 200, active: false, outerStart: false, outerEnd: true },
    ]);
  });

  it('is active between a range’s thumbs, cut back around each for a gap', () => {
    const segments = getTrackSegments(200, [50, 150], true, 8);
    expect(segments.map((s) => [s.start, s.end, s.active])).toEqual([
      [0, 42, false],
      [58, 142, true],
      [158, 200, false],
    ]);
  });

  it('drops a piece the gap swallows', () => {
    expect(getTrackSegments(200, [2], false, 8).map((s) => s.key)).toEqual(['1']);
  });
});

describe('getMarks', () => {
  const base = { min: 0, max: 100, width: 220, inset: 10, range: false, cut: 0, stopIndicators: false, custom: [] };

  it('puts a mark on every step, active up to the thumb', () => {
    const marks = getMarks({ ...base, step: 25, thumbs: [110], showSteps: true });
    expect(marks.map((m) => [m.x, m.active])).toEqual([
      [10, true],
      [60, true],
      [160, false],
      [210, false],
    ]);
  });

  it('leaves out steps that would run together', () => {
    expect(getMarks({ ...base, step: 1, thumbs: [110], showSteps: true })).toEqual([]);
  });

  it('draws the marks prop’s marks instead, active ones too', () => {
    const marks = getMarks({ ...base, step: 1, thumbs: [110], showSteps: false, stopIndicators: true, custom: [0, 0.2, 0.37, 1] });
    expect(marks.map((m) => [m.x, m.active])).toEqual([
      [10, true],
      [50, true],
      [84, true],
      [210, false],
    ]);
  });

  it('draws Material’s stop indicators at the inactive ends only, none in a thumb’s gap', () => {
    const stops = { ...base, step: 1, showSteps: false, stopIndicators: true, cut: 8 };
    expect(getMarks({ ...stops, thumbs: [110] }).map((m) => m.x)).toEqual([210]);
    expect(getMarks({ ...stops, thumbs: [60, 160], range: true }).map((m) => m.x)).toEqual([10, 210]);
    expect(getMarks({ ...stops, thumbs: [205] })).toEqual([]);
  });
});

describe('getHaloLevel', () => {
  const idle = { enabled: true, dragging: null, hovered: null, focused: null };

  it('is pressed while dragged, faint while hovered or focused, else none', () => {
    expect(getHaloLevel(0, idle)).toBe(0);
    expect(getHaloLevel(1, { ...idle, hovered: 1 })).toBe(1);
    expect(getHaloLevel(0, { ...idle, hovered: 1 })).toBe(0);
    expect(getHaloLevel(0, { ...idle, focused: 0 })).toBe(1);
    expect(getHaloLevel(0, { ...idle, hovered: 0, dragging: 0 })).toBe(2);
  });

  it('shows none without a halo or while disabled', () => {
    expect(getHaloLevel(0, { ...idle, enabled: false, dragging: 0 })).toBe(0);
  });
});

describe('marks', () => {
  it('reads numbers and objects, in range and in order', () => {
    expect(normalizeMarks([100, { value: 20, label: '20°C' }, 0, 150], 0, 100)).toEqual([
      { value: 0 },
      { value: 20, label: '20°C' },
      { value: 100 },
    ]);
  });

  it('snaps to the nearest mark and steps from mark to mark', () => {
    const marks = [0, 20, 37, 100];
    expect(nearestMark(30, marks)).toBe(37);
    expect(nearestMark(60, marks)).toBe(37);
    expect(nearestMark(5, [])).toBe(5);
    expect(stepToMark(20, marks, 1)).toBe(37);
    expect(stepToMark(20, marks, -1)).toBe(0);
    expect(stepToMark(25, marks, -1)).toBe(20);
    expect(stepToMark(100, marks, 1)).toBe(100);
  });

  it('places the labelled marks, active inside the filled track', () => {
    const labels = getMarkLabels([{ value: 0, label: '0°C' }, { value: 50 }, { value: 100, label: '100°C' }], {
      min: 0,
      max: 100,
      width: 220,
      inset: 10,
      thumbs: [110],
      range: false,
    });
    expect(labels).toEqual([
      { key: '0', x: 10, label: '0°C', active: true },
      { key: '100', x: 210, label: '100°C', active: false },
    ]);
  });
});
