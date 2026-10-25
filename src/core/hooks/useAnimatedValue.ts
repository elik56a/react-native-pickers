import { useRef } from 'react';
import { Animated } from 'react-native';

/** One `Animated.Value` for the component's lifetime. React Native has this built in, but react-native-web doesn't export it. */
export const useAnimatedValue = (initial: number): Animated.Value => useRef(new Animated.Value(initial)).current;
