import React from 'react';
import Link from 'next/link';
import { linearGradientRed } from '../theme';

type NavItemProps = {
  href: string;
  id?: string;
  className?: string;
  external?: boolean;
  children: React.ReactNode;
};

const NavItem = ({ id, href, children, className, external }: NavItemProps) => (
  <li className="nav-item">
    {external ? (
      <a id={id} href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    ) : (
      <Link href={href}>
        <a id={id} className={className}>
          {children}
        </a>
      </Link>
    )}

    <style jsx>{`
      .nav-item a {
        display: inline-block;
        padding: 16px 0;
        text-decoration: none;
        font-size: 18px;
        color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        background-image: ${linearGradientRed};
      }
      .nav-item {
        margin-right: 16px;
      }
      .nav-item:last-child {
        margin-right: 0;
      }
      @media (max-width: 600px) {
        .nav-item a {
          padding: 8px 0;
        }
      }
    `}</style>
  </li>
);
export default NavItem;
