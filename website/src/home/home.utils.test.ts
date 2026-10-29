import { NPM_DOWNLOADS_STATUS } from './home.constants';
import { easeOutCubic, parseDownloads, revealDelay } from './home.utils';

describe('parseDownloads', () => {
  it('reads the count and treats anything else as unavailable', () => {
    expect(parseDownloads({ downloads: 670 })).toBe(670);
    expect(parseDownloads({ error: 'package not found' })).toBe(NPM_DOWNLOADS_STATUS.unavailable);
    expect(parseDownloads(null)).toBe(NPM_DOWNLOADS_STATUS.unavailable);
  });
});

describe('easeOutCubic', () => {
  it('starts at 0, ends at 1 and front-loads the motion', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

describe('revealDelay', () => {
  it('spaces each step by the reveal step', () => {
    expect(revealDelay(3)).toEqual({ '--delay': '270ms' });
  });
});
