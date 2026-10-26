import { NPM_DOWNLOADS_STATUS } from './home.constants';
import { easeOutCubic, npmDownloadsUrl, parseDownloads, revealDelay } from './home.utils';

describe('npmDownloadsUrl', () => {
  it('ends the range on the UTC day npm counts by', () => {
    expect(npmDownloadsUrl(new Date('2026-10-27T23:30:00-05:00'))).toBe(
      'https://api.npmjs.org/downloads/point/2020-01-01:2026-10-28/@elik56a/react-native-pickers'
    );
  });
});

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
