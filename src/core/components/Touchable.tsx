import type { PressableStateCallbackType } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import type { TouchableProps } from '../core.types';
import { useTouchFeedback } from '../hooks/useTouchFeedback';
import { TouchFeedback } from './TouchFeedback';

/** A Pressable with the theme's hover tint and press ripple, clipped to its own corners. */
export const Touchable = ({
  theme,
  ripple = true,
  disabled,
  style,
  children,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  ...rest
}: TouchableProps) => {
  const touch = useTouchFeedback(theme, !!disabled, ripple);
  const styleFor = (state: PressableStateCallbackType) => (typeof style === 'function' ? style(state) : style);

  return (
    <Pressable
      ref={touch.ref}
      disabled={disabled}
      {...rest}
      onPressIn={(e) => {
        touch.handlers.onPressIn(e);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        touch.handlers.onPressOut();
        onPressOut?.(e);
      }}
      onHoverIn={(e) => {
        touch.handlers.onHoverIn();
        onHoverIn?.(e);
      }}
      onHoverOut={(e) => {
        touch.handlers.onHoverOut();
        onHoverOut?.(e);
      }}
      style={styleFor}
    >
      {(state) => {
        const borderRadius = StyleSheet.flatten(styleFor(state))?.borderRadius;
        return (
          <>
            <TouchFeedback {...touch.feedback} borderRadius={typeof borderRadius === 'number' ? borderRadius : undefined} />
            {typeof children === 'function' ? children(state) : children}
          </>
        );
      }}
    </Pressable>
  );
};
