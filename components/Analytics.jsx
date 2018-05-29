import Router from 'next/router';
import NProgress from 'nprogress';
import ReactGA from 'react-ga';

import { GA_ID } from '../util/constants';

const isDev = () => typeof window !== 'undefined' && window.location.hostname !== 'localhost';

if (isDev()) {
  ReactGA.initialize(GA_ID);
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => {
  NProgress.done();
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }
};
Router.onRouteChangeError = () => NProgress.done();

export default () => null;
