import React from 'react';
import Link from 'next/link';
import cx from 'classnames';

const BACKGROUND_SIZE = 800;

type BackgroundCircleProps = {
  position?: 'top' | 'bottom';
  fixedSize?: boolean;
  color: string;
};

const BackgroundCircle = ({
  position = 'top',
  fixedSize = false,
  color,
}: BackgroundCircleProps) => (
  <div
    className={cx(
      'circle',
      position === 'top' && 'circle--top',
      position === 'bottom' && 'circle--bottom',
      fixedSize && 'circle--fixedSize',
    )}
    style={{ background: color }}
  >
    <style jsx>{`
      .circle {
        width: 70vh;
        height: 70vh;
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
      }
      .circle--top {
        left: 25%;
        top: -25%;
        transform: translateX(-50%);
      }
      .circle--bottom {
        bottom: -25%;
        right: 0;
        transform: translateX(50%);
      }
      .circle--fixedSize {
        width: ${BACKGROUND_SIZE}px;
        height: ${BACKGROUND_SIZE}px;
      }
    `}</style>
  </div>
);
export default BackgroundCircle;
