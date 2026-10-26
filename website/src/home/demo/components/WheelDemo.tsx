import { useState } from 'react';

import { WheelPicker } from '@elik56a/react-native-pickers';
import type { TabOptions } from '../../playground/playground.types';
import { DEFAULT_SIZE, SIZES } from '../demo.constants';

export const WheelDemo = ({ options }: { options: TabOptions<'wheel'> }) => {
  const [size, setSize] = useState(DEFAULT_SIZE);
  return (
    <WheelPicker
      items={SIZES}
      value={size}
      onChange={setSize}
      variant={options.variant}
      loop={options.loop}
      visibleItems={options.visibleItems}
    />
  );
};
