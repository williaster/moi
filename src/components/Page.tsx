import React from 'react';
import cx from 'classnames';
import Router from 'next/router';
import NProgress from 'nprogress';

import Meta from './Meta';
import Nav from './Nav';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const Page = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string | boolean;
}) => (
  <div className={cx('main', className)}>
    <Meta title={title} />
    <div className="nav-container">
      <Nav />
    </div>
    <div className="page-content">{children}</div>
    <style jsx global>{`
      .main {
        width: 100%;
        height: 100%;
        padding: 0 24px;
      }

      .page-content {
        margin: 24px 0 40px;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }

      /* loading progress bar styles */
      #nprogress {
        pointer-events: none;
      }

      #nprogress .bar {
        background: #ac73ff;
        position: fixed;
        z-index: 1001;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }
    `}</style>
  </div>
);
export default Page;
