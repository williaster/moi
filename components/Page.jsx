import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Meta from './Meta';
import Nav from './Nav';

import { DEFAULT_TITLE } from '../util/constants';

function Page({ children, title, className }) {
  return (
    <div className={cx('main', className)}>
      <Meta title={title} />
      <div className="nav-container">
        <Nav />
      </div>
      <div className="page-content">{children}</div>
      <style jsx>
        {`
          .main {
            width: 100vw;
            margin: 0 auto;
            overflow-x: hidden;
          }
          .page-content {
            width: 95vw;
            margin: 55px auto 40px;
            color: #161616;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
          }

          .nav-container {
            background: #ffffff;
          }
        `}
      </style>
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};

Page.defaultProps = {
  title: DEFAULT_TITLE,
  className: '',
};

export default Page;
