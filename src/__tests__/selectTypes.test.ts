import type { Dispatch, SetStateAction } from 'react';
import type { SelectListProps, SelectPickerProps } from '../index';

// Type-level regression test: ts-jest fails this file if `onChange={setState}` stops compiling.
const picker = <T>(props: SelectPickerProps<T>) => props;
const list = <T>(props: SelectListProps<T>) => props;

const options = [{ label: 'A', value: 'a' }];
const setOne = (() => {}) as Dispatch<SetStateAction<string | null>>;
const setMany = (() => {}) as Dispatch<SetStateAction<string[]>>;

describe('SelectValueProps', () => {
  it('accepts React state setters as onChange in single and multiple mode', () => {
    picker({ options, value: null, onChange: setOne });
    picker({ multiple: true, options, value: [], onChange: setMany });
    list({ multiple: true, options, value: [], onChange: setMany });
    // @ts-expect-error the value type still comes from options
    picker({ multiple: true, options, value: [], onChange: (v: number[]) => v });
    expect(picker({ options, onChange: setOne }).options).toBe(options);
  });
});
