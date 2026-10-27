/** Places a portal host exactly over the device screen, with the same rounded corners. */
export const pinOver = (host: HTMLElement, frame: HTMLElement) => {
  const rect = frame.getBoundingClientRect();
  Object.assign(host.style, {
    position: 'absolute',
    left: `${rect.left + frame.clientLeft + window.scrollX}px`,
    top: `${rect.top + frame.clientTop + window.scrollY}px`,
    width: `${frame.clientWidth}px`,
    height: `${frame.clientHeight}px`,
    borderRadius: `${Number.parseFloat(getComputedStyle(frame).borderTopLeftRadius) - frame.clientLeft}px`,
    overflow: 'hidden',
    transform: 'translateZ(0)',
    zIndex: '1',
  });
};
