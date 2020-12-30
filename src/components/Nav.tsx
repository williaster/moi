import React from 'react';
import NavItem from './NavItem';

const Nav = () => (
  <div className="nav">
    <div className="nav-inner">
      <NavItem href="/">chris williams</NavItem>
      <ul>
        <NavItem href="/projects">projects</NavItem>
        <NavItem href="/about">about</NavItem>
      </ul>
    </div>

    <style jsx>{`
      .nav {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex: 1;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        z-index: 3;
        position: sticky;
        top: 0;
        padding: 0 24px;
        background: #fff;
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
      @media (max-width: 200px) {
        .nav-inner,
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
