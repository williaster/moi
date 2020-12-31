import React from 'react';
import cx from 'classnames';

const fixedSizeSize = 800;

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
  <>
    <div
      className={cx(
        'circle',
        position === 'top' && 'circle--top',
        position === 'bottom' && 'circle--bottom',
        fixedSize && 'circle--fixedSize',
        fixedSize && (position === 'top' ? 'circle--fixedSize-top' : 'circle--fixedSize-bottom'),
      )}
      style={{ background: color }}
    ></div>

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
        right: 25%;
        transform: translateX(50%);
      }
      .circle--fixedSize {
        width: ${fixedSizeSize}px;
        height: ${fixedSizeSize}px;
      }
      .circle--fixedSize-top {
        left: ${Math.floor(0.25 * fixedSizeSize)}px;
        top: -${Math.floor(0.25 * fixedSizeSize)}px;
      }
      .circle--fixedSize-bottom {
        right: ${Math.floor(0.25 * fixedSizeSize)}px;
        bottom: -${Math.floor(0.25 * fixedSizeSize)}px;
      }
    `}</style>
  </>
);
export default BackgroundCircle;
