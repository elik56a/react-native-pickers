import { useState } from 'react';

import type { PlaygroundConfig, PlaygroundOption, PlaygroundSelection } from '../catalog.types';
import { initialSelection, resolveValue, selectedProps } from '../catalog.utils';

/** The chosen options and the live props they make, with the value controlled when the playground has one. */
export const usePlayground = ({ controls, props, value, changeProp = 'onChange', resetProp }: PlaygroundConfig) => {
  const [selection, setSelection] = useState<PlaygroundSelection>(() => initialSelection(controls));
  const [current, setCurrent] = useState(() => resolveValue(value, selection));

  const choose = (prop: string, option: PlaygroundOption) => {
    const next = { ...selection, [prop]: option };
    setSelection(next);
    if (typeof value === 'function') setCurrent(resolveValue(value, next));
  };

  const live = {
    ...props,
    ...selectedProps(controls, selection),
    ...(value === undefined ? {} : { value: current, [changeProp]: setCurrent }),
    ...(resetProp ? { [resetProp]: () => setCurrent(resolveValue(value, selection)) } : {}),
  };

  return {
    selection,
    choose,
    live,
  };
};
