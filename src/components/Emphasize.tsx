import React from 'react';
import { linearGradientRed } from '../theme';

const Emphasize = ({ children }: { children: React.ReactNode }) => (
  <>
    <span className="emphasize">{children}</span>
    <style jsx>{`
      .emphasize {
        font-weight: 600;
        background-image: ${linearGradientRed};
        overflow-wrap: break-word;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-box-decoration-break: clone; // needed for multi-line gradients in safari
        -moz-background-clip: text;
        -moz-text-fill-color: transparent;
        -ms-background-clip: text;
        -ms-text-fill-color: transparent;
        color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
    `}</style>
  </>
);

export default Emphasize;
