import type { AccessibilityActionEvent, KeyDownEvent } from 'react-native';

import { adjustableProps } from './adjustable.utils';

const action = (actionName: string) => ({ nativeEvent: { actionName } }) as AccessibilityActionEvent;
const key = (k: string) =>
  ({
    nativeEvent: { key: k },
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  }) as unknown as KeyDownEvent;

describe('adjustableProps', () => {
  it('steps on screen-reader actions and arrow keys, pages, and goes to the ends', () => {
    const onStep = jest.fn();
    const onPage = jest.fn();
    const onMin = jest.fn();
    const onMax = jest.fn();
    const props = adjustableProps({ label: 'Volume', valueText: '40', onStep, onPage, onMin, onMax });
    expect(props).toMatchObject({ accessibilityRole: 'adjustable', accessibilityLabel: 'Volume', accessibilityValue: { text: '40' } });
    props.onAccessibilityAction(action('increment'));
    props.onAccessibilityAction(action('decrement'));
    props.onKeyDown?.(key('ArrowRight'));
    props.onKeyDown?.(key('ArrowDown'));
    expect(onStep.mock.calls).toEqual([[1], [-1], [1], [-1]]);
    props.onKeyDown?.(key('PageUp'));
    expect(onPage).toHaveBeenCalledWith(1);
    props.onKeyDown?.(key('Home'));
    props.onKeyDown?.(key('End'));
    expect(onMin).toHaveBeenCalled();
    expect(onMax).toHaveBeenCalled();
  });

  it('ignores steps and keys while disabled', () => {
    const onStep = jest.fn();
    const props = adjustableProps({ valueText: '1', disabled: true, onStep });
    props.onAccessibilityAction(action('increment'));
    expect(onStep).not.toHaveBeenCalled();
    expect('onKeyDown' in props).toBe(false);
    expect(props.accessibilityState).toEqual({ disabled: true });
  });
});
