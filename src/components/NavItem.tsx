import React from 'react';
import Link from 'next/link';

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
        padding: 10px;
        text-decoration: none;
        color: #272727;
        font-weight: 400;
        font-size: 18px;
      }

      @media (max-width: 600px) {
        .nav-item {
          display: block;
          float: left;
        }
      }
    `}</style>
  </li>
);
export default NavItem;
