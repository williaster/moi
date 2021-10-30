import React, { useRef } from 'react';
import * as THREE from 'three';
import { Html, Scroll, useScroll } from '@react-three/drei';

import { textColorDark, textColor, highlightColor } from './colors';
import { useFrame, useThree } from '@react-three/fiber';

const easeInOut = (t: number, inOrOut: 'in' | 'out') => {
  return inOrOut === 'in' ? 1 - (1 - t) * (1 - t) : 1 - Math.pow(1 - t, 10);
};

const numPages = 7;
const singlePageSize = 1 / numPages;
const easeMargin = singlePageSize * 0.1; // margin
const firstPage = 1;
const lastPage = numPages;

function useTitlePositioning(page: 1 | 2 | 3 | 4 | 5 | 6 | 7) {
  // refs which are modified by this hook
  const containerRef = useRef<HTMLDivElement>();

  const scroll = useScroll();
  useFrame(() => {
    const currPage = 1 + scroll.offset / singlePageSize; // [1, 7]
    const isFirstPage = page === firstPage;
    const isLastPage = page === lastPage;
    const isEaseOut = isFirstPage || (currPage > page + 0.5 && !isLastPage);
    const sign = isEaseOut ? -1 : 1;
    // if (page === 2 && Math.random() > 0.99)
    //   console.log({ offset: scroll.offset, currPage, isEaseOut });

    const transitionStart = (page - 1) / numPages;

    let t: number;

    // for the first page only transition out
    // for the last page only transition in
    if (isFirstPage || isLastPage) {
      t = scroll.range(
        transitionStart,
        singlePageSize, // distance
        easeMargin,
      );
      if (isFirstPage) t = 1 - t; // (1-range), because range is [0,1]
    } else {
      // for all other pages transition in + out: 0 => 1 => 0
      t = scroll.curve(
        transitionStart,
        singlePageSize, // distance
        easeMargin,
      );
    }

    const tEased = easeInOut(t, isEaseOut ? 'out' : 'in');
    containerRef.current.style.opacity = `${tEased}`;
    containerRef.current.style.transform = `translateY(${(1 - tEased) * sign * 15}vh)rotateX(${(1 -
      tEased) *
      sign *
      -90}deg)`;
  });

  return containerRef;
}

const headerStyle = {
  fontSize: '2em',
  fontWeight: 700,
  color: textColorDark,
  position: 'absolute',
  top: 38,
  left: 32,
  maxWidth: '80vw',
} as const;

const textStyle = {
  fontSize: '0.55em',
  color: textColor,
  lineHeight: '1.2em',
};

const emphasisStyle = {
  color: textColorDark,
  fontWeight: 700,
};

const friedStyle = emphasisStyle;
const unfriedStyle = { ...emphasisStyle, color: textColor };
const ratioStyle = { ...emphasisStyle, color: highlightColor };
const friedColorStyle = { color: textColorDark };

// don't break scrolling
const htmlStyle = { pointerEvents: 'none' } as const;

export default function Title() {
  const one = useTitlePositioning(1);
  const two = useTitlePositioning(2);
  const three = useTitlePositioning(3);
  const four = useTitlePositioning(4);
  const five = useTitlePositioning(5);
  const six = useTitlePositioning(6);
  const seven = useTitlePositioning(7);

  return (
    <Html fullscreen style={htmlStyle}>
      <div style={{ lineHeight: '1em', fontSize: '2vh' }}>
        <div ref={one} style={headerStyle}>
          Potato ranks 🥔
          <p style={textStyle}>
            3D modeling of various potato forms enabled objective ranking by a quantitative
            heuristic: <span style={emphasisStyle}>the fried ratio</span>. Scroll for more.
          </p>
        </div>

        <div ref={two} style={headerStyle}>
          Intuition
          <p style={textStyle}>
            Intuitively you know that eating a curly fry is way better than a straight up potato.
            <br />
            <br />
            <span style={emphasisStyle}>But why tho?</span>
          </p>
        </div>
        <div ref={three} style={headerStyle}>
          Fried vs unfried
          <p style={textStyle}>
            A key difference between potato forms is <span style={emphasisStyle}>how fried</span>{' '}
            they can possibly be. To quantify this we modeled and compared
            <br />
            <br />
            Potato <span style={friedColorStyle}>surface area</span> (
            <span style={friedStyle}>fried</span>) vs
            <br />
            Potato volume (<span style={unfriedStyle}>unfried</span>)
          </p>
        </div>
        <div ref={four} style={headerStyle}>
          Visualizing fried vs unfried
          <p style={textStyle}>
            To accurately capture <span style={friedStyle}>fried</span> and{' '}
            <span style={unfriedStyle}>unfried</span> portions we visualize them with the following
            representation. <br />
            <br /> <span style={friedStyle}>Blue</span> represents surface area (
            <span style={friedColorStyle}>fried</span>) and
            <br />
            <span style={unfriedStyle}>Grey</span> represents volume (unfried).
          </p>
        </div>
        <div ref={five} style={headerStyle}>
          Visualizing all potatoes
          <p style={textStyle}>
            Comparing <span style={friedStyle}>fried</span> vs{' '}
            <span style={unfriedStyle}>unfried</span> portions across potato forms shows they are
            not all created equal.
          </p>
        </div>
        <div ref={six} style={headerStyle}>
          Quality: the fried <span style={ratioStyle}>ratio</span>
          <p style={textStyle}>
            We can go one step further and compute the true measure of potato quality:
            <br />
            <br />
            <span style={{ fontFamily: 'monospace' }}>
              <span style={ratioStyle}>ratio</span> = <span style={friedStyle}>fried</span> /{' '}
              <span style={unfriedStyle}>unfried</span>
            </span>
          </p>
        </div>
        <div ref={seven} style={headerStyle}>
          Quality: the fried <span style={ratioStyle}>ratio</span>
          <p style={textStyle}>
            Plotting this ratio along the x-axis shows that potatoes are not all created equal, your
            favorite forms are more fried.
          </p>
        </div>
      </div>

      {/* <h1 ref={three} style={{ position: 'absolute', left: 32 }}>
        3rd page
      </h1>
      <h1 style={{ position: 'absolute', left: 32 }}>4th page</h1>
      <h1 style={{ position: 'absolute', left: 32 }}>5th page</h1>
      <h1 style={{ position: 'absolute', left: 32 }}>6th page</h1>
      <h1 style={{ position: 'absolute', left: 32 }}>7th page</h1> */}
    </Html>
  );
}