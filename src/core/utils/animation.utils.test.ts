import { Animated } from 'react-native';

import { EASE_OUT, USE_NATIVE_DRIVER } from '../core.constants';
import { spring, timing } from './animation.utils';

describe('animation utils', () => {
  afterEach(() => jest.restoreAllMocks());

  it('times with ease-out and the native driver by default', () => {
    const spy = jest.spyOn(Animated, 'timing');
    const value = new Animated.Value(0);
    timing(value, 1, { duration: 100 });
    expect(spy).toHaveBeenCalledWith(value, {
      toValue: 1,
      duration: 100,
      easing: EASE_OUT,
      delay: undefined,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
  });

  it('lets layout animations opt out of the native driver', () => {
    const spy = jest.spyOn(Animated, 'timing');
    timing(new Animated.Value(0), 1, { duration: 100, native: false });
    expect(spy).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ useNativeDriver: false }));
  });

  it('springs with the native driver by default', () => {
    const spy = jest.spyOn(Animated, 'spring');
    const value = new Animated.Value(0);
    spring(value, 0, { bounciness: 4 });
    expect(spy).toHaveBeenCalledWith(value, {
      toValue: 0,
      bounciness: 4,
      speed: undefined,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
  });
});
