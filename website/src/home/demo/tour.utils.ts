import { CONFIRM_LABELS, DAY_LABEL_FORMAT, RESERVE_TEST_ID, TOUR_DAYS_AHEAD } from './demo.constants';
import type { TourTarget, TourTrip } from './demo.types';
import { daysFromNow } from './demo.utils';

/** react-native-web portals sheets and dropdowns to <body>, outside the Docusaurus app. */
const portalButtons = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[role="button"], [role="radio"]')).filter((el) => !el.closest('#__docusaurus'));

/** The open calendar's days from today on, in order; disabled cells aren't marked as such on the web, so they're found by date. */
const bookableDays = () => {
  const buttons = portalButtons();
  const format = new Intl.DateTimeFormat(undefined, DAY_LABEL_FORMAT);
  return Array.from({ length: TOUR_DAYS_AHEAD }, (_, i) => format.format(daysFromNow(i)))
    .map((label) => buttons.find((el) => el.getAttribute('aria-label') === label))
    .filter((el) => el !== undefined);
};

/** The element the tour taps next: the hero's own fields and button, or the open sheet's content. */
export const findTourTarget = (target: TourTarget, root: HTMLElement, trip: TourTrip): HTMLElement | undefined => {
  switch (target.kind) {
    case 'field':
      return root.querySelector<HTMLElement>(`[role="button"][aria-label="${target.label}"]`) ?? undefined;
    case 'reserve':
      return root.querySelector<HTMLElement>(`[data-testid="${RESERVE_TEST_ID}"]`) ?? undefined;
    case 'option':
      return portalButtons()
        .filter((el) => el.getAttribute('aria-label') === trip.city)
        .pop();
    case 'day':
      return bookableDays()[trip[target.end]];
    case 'confirm':
      return portalButtons()
        .filter((el) => CONFIRM_LABELS.includes(el.textContent?.trim() ?? ''))
        .pop();
  }
};

/** The middle of an element, in page coordinates. */
export const centerOf = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 + window.scrollX,
    y: rect.top + rect.height / 2 + window.scrollY,
  };
};
