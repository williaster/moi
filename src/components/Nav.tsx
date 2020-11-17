import React from 'react';
import Link from 'next/link';
import NavItem from './NavItem';

const Nav = () => (
  <div className="nav">
    <div className="nav-inner wrapper">
      <Link href="/">
        <div className="logo">
          christopher card williams
        </div>
      </Link>
      <ul>
        <NavItem href="/">
          Home
        </NavItem>
        <NavItem href="/projects">Projects</NavItem>
        <NavItem href="/about">About</NavItem>
      </ul>
    </div>

    <style jsx>{`
      .logo {
      }
    
      .nav-inner {
        width: 95vw;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      .nav {
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        font-size: 16px;
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
        justify-content: flex-start;
        align-items: center;
      }
      @media (max-width: 600px) {
        .nav {
          padding: 0;
          padding-right: 1rem;
        }

        .nav-inner {
          width: 99vw;
        }
      }
    `}</style>
  </div>
);

export default Nav;
