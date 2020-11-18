import React from 'react';
import Link from 'next/link';
import NavItem from './NavItem';

const Nav = () => (
  <div className="nav">
    <div className="nav-inner">
      <NavItem href="/">christopher card williams</NavItem>
      <ul>
        <NavItem href="/projects">projects</NavItem>
        <NavItem href="/about">about</NavItem>
      </ul>
    </div>

    <style jsx>{`
      .nav {
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        z-index: 3;
        position: sticky;
        top: 0;
        margin: 0 -16px;
        background-color: #d5fdff99;
        padding-left: 16px;
      }
      .nav-inner {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: space-between;
        justify-content: center;
        flex-wrap: wrap;
      }
      ul {
        list-style-type: none;
        display: flex;
        flex: 1;
        flex-direction: row;
        padding: 0;
        margin: 0;
        justify-content: flex-end;
        align-items: center;
      }
      @media (max-width: 600px) {
        .nav {
          padding: 0;
          padding-right: 1rem;
        }

        ul {
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }
      }
    `}</style>
  </div>
);

export default Nav;
