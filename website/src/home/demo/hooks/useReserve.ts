import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import { RESERVE_PHASE, RESERVED_MS, RESERVED_POP_FROM, RESERVING_MS } from '../demo.constants';
import type { ReservePhase } from '../demo.types';

/** Reserving fills the button like a progress bar, then the confirmation pops in and goes back to the price. */
export const useReserve = () => {
  const [phase, setPhase] = useState<ReservePhase>(RESERVE_PHASE.idle);
  const progress = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (phase === RESERVE_PHASE.reserving) {
      progress.setValue(0);
      const fill = Animated.timing(progress, {
        toValue: 1,
        duration: RESERVING_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      fill.start(({ finished }) => finished && setPhase(RESERVE_PHASE.reserved));
      return () => fill.stop();
    }
    if (phase === RESERVE_PHASE.reserved) {
      pop.setValue(RESERVED_POP_FROM);
      Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: true }).start();
      const id = setTimeout(() => setPhase(RESERVE_PHASE.idle), RESERVED_MS);
      return () => clearTimeout(id);
    }
  }, [phase, progress, pop]);

  return {
    phase,
    progress,
    pop,
    reserve: () => setPhase(RESERVE_PHASE.reserving),
  };
};
