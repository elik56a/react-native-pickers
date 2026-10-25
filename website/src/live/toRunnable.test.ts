import { toRunnable } from './toRunnable';

describe('toRunnable', () => {
  it('strips single- and multi-line imports and renders the default export', () => {
    const code = `import { useState } from 'react';
import {
  DatePicker,
  formatDate,
} from '@elik56a/react-native-pickers';
import type { DateRange } from '@elik56a/react-native-pickers';

export default function Example() {
  return null;
}`;
    expect(toRunnable(code)).toBe('function Example() {\n  return null;\n}\nrender(<Example />);');
  });

  it('wraps a bare expression in render()', () => {
    expect(toRunnable('<View />;')).toBe('render(<View />);');
  });

  it('leaves code that already calls render() untouched', () => {
    expect(toRunnable('render(<View />);')).toBe('render(<View />);');
  });
});
