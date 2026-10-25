// react-native-web stamps `isDefaultPrevented` onto native events (modules/addEventListener). The local search's
// zepto (@easyops-cn/autocomplete.js) takes that as "already wrapped", skips adding `isImmediatePropagationStopped`,
// then calls it and throws on every keystroke and result click, so results never navigate.
if (typeof Event !== 'undefined' && !('isImmediatePropagationStopped' in Event.prototype)) {
  Object.defineProperty(Event.prototype, 'isImmediatePropagationStopped', {
    value: () => false,
    configurable: true,
    writable: true,
  });
}
