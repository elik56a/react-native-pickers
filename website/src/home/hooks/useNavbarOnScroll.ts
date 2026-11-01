import { useEffect } from 'react';

import { NAV_SHOW_SCROLL } from '../home.constants';

/** Shows the home page's navbar, hidden at the very top so the hero gets the whole screen, once the page scrolls a little (home.module.css). */
export const useNavbarOnScroll = () => {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => root.toggleAttribute('data-nav-shown', window.scrollY > NAV_SHOW_SCROLL);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      root.removeAttribute('data-nav-shown');
    };
  }, []);
};
