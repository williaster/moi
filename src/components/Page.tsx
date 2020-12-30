import React from 'react';
import cx from 'classnames';
import Router from 'next/router';
import NProgress from 'nprogress';

import Meta from './Meta';
import Nav from './Nav';
import { linearGradient } from '../theme';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const Page = ({
  children,
  title,
  className,
  showNav = true,
  padding = true,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string | boolean;
  showNav?: boolean;
  padding?: boolean;
}) => (
  <div className={cx('main', className)}>
    <Meta title={title} />
    {showNav && (
      <div className="nav-container">
        <Nav />
      </div>
    )}
    <div className={cx('page', showNav && 'page--nav', padding && 'page--padding')}>{children}</div>
    <style jsx global>{`
      .main {
        width: 100%;
        height: 100%;
      }

      .nav-container {
        background: transparent;
      }

      .page {
        height: 100%;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .page--nav {
        padding-bottom: 40px;
      }

      .page--padding {
        padding: 0 24px;
      }

      /* loading progress bar styles */
      #nprogress {
        pointer-events: none;
      }

      #nprogress .bar {
        background: ${linearGradient};
        position: fixed;
        z-index: 1001;
        top: 1px;
        left: 0;
        width: 100%;
        height: 3px;
      }
    `}</style>
  </div>
);
export default Page;
