import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

function NavItem({ href, children, className }) {
  return (
    <li className="NavItem">
      <Link prefetch href={href}>
        <a // eslint-disable-line
          className={className}
        >
          {children}
        </a>
      </Link>

      <style jsx>
        {`
          .NavItem a {
            display: inline-block;
            padding: 10px;
            text-decoration: none;
            color: #fc2e1c;
            font-weight: 600;
          }

          @media (max-width: 600px) {
            .NavItem {
              display: block;
              float: left;
            }

            .NavItem .github {
              margin-top: 0;
            }
          }
        `}
      </style>
    </li>
  );
}

NavItem.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
};

NavItem.defaultProps = {
  className: '',
};

export default NavItem;
