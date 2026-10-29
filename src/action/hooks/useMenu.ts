import { useState } from 'react';

import { useAnchor } from '../../sheet/hooks/useAnchor';
import type { MenuProps, MenuState } from '../action.types';
import { useActionPress } from './useActionPress';

/** Opens the menu from its measured trigger, and runs a pressed action once the menu has closed. */
export const useMenu = ({ disabled, onOpen, onClose }: MenuProps): MenuState => {
  const anchor = useAnchor();
  const [visible, setVisible] = useState(false);
  const open = () => {
    if (disabled) return;
    anchor.measure();
    setVisible(true);
    onOpen?.();
  };
  const close = () => {
    setVisible(false);
    onClose?.();
  };
  const { press, onClosed } = useActionPress(close);

  return {
    anchor,
    visible,
    open,
    close,
    press,
    onClosed,
  };
};
