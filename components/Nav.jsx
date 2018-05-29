import Link from 'next/link';
import React from 'react';

import NavItem from './NavItem';

export default function Nav() {
  return (
    <div className="nav">
      <div className="nav-inner">
        <Link href="/">
          <div className="logo" />
        </Link>
        <ul>
          <NavItem href="/">Home</NavItem>
          <NavItem href="/projects">Projects</NavItem>
          <NavItem href="/about">About</NavItem>
        </ul>
      </div>

      <style jsx>
        {`
          .nav-inner {
            width: 95vw;
            margin: 0 auto;
            display: flex;
            flex-direction: row;
            align-navitems: center;
            justify-content: center;
          }
          .nav {
            display: flex;
            flex-direction: row;
            flex: 1;
            align-navitems: center;
            justify-content: center;
            padding: 0 10px;
            font-size: 14px;
            z-index: 3;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            margin: 0;
            background: #ffffff;
          }
          ul {
            list-style-type: none;
            display: flex;
            flex: 1;
            flex-direction: row;
            padding: 0;
            margin: 0;
            color: white;
            justify-content: flex-start;
            align-navitems: center;
          }
          @media (max-width: 600px) {
            .github-buttons {
              display: none;
            }
            .NavItem {
              float: left;
            }

            .nav {
              padding: 0;
            }

            .nav-inner {
              width: 99vw;
            }
          }
        `}
      </style>
    </div>
  );
}
