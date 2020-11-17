import React from 'react';
import cx from 'classnames';
import Meta from './Meta';
import Nav from './Nav';

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
    <style jsx>{`
      .main {
        width: 95vw;
        margin: 0 auto;
        overflow-x: hidden;
      }
      
      .page-content {
        margin: 69px 0 40px;
        color: #161616;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }

      .nav-container {
        background: #ffffff;
      }

      /* loading progress bar styles */
      #nprogress {
        pointer-events: none;
      }

      #nprogress .bar {
        background: violet;
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
      }

      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px purple, 0 0 5px purple;
        opacity: 1;
        transform: rotate(3deg) translate(0px, -4px);
      }

      
    `}</style>
  </div>
);
export default Page;
