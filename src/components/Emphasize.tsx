import React from 'react';
import { linearGradientRed } from '../theme';

const Emphasize = ({ children }: { children: React.ReactNode }) => (
  <>
    <span className="emphasize">{children}</span>
    <style jsx>{`
      .emphasize {
        font-weight: 600;
        color: transparent;
        background: ${linearGradientRed};
        background-clip: text;
        -webkit-background-clip: text;
      }
    `}</style>
  </>
);

export default Emphasize;
