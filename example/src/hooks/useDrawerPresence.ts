import { usePickerTheme } from '@elik56a/react-native-pickers';
import { usePresence } from '../../../src/core/hooks/usePresence';
import { DRAWER_WIDTH } from '../example.constants';

/** The phone drawer slides in from the side over a fading backdrop, and stays mounted until it has slid out. */
export const useDrawerPresence = (open: boolean) => {
  const { animation } = usePickerTheme();
  const { mounted, progress } = usePresence({ visible: open, duration: animation.duration });
  return {
    mounted,
    panelStyle: { transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-DRAWER_WIDTH, 0] }) }] },
    backdropStyle: { opacity: progress },
  };
};
