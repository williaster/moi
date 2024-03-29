import React, { forwardRef, useRef } from 'react';
import { Html, useScroll } from '@react-three/drei';

import { textColorDark, textColor, highlightColor } from './colors';
import { useFrame, useThree } from '@react-three/fiber';
import Copy from '../Copy';
import easingFunctions from './utils/easingFunctions';
import getViewportWidth from './utils/getViewportWidth';

const numPages = 8;
const singlePageSize = 1 / numPages;
const easeMargin = singlePageSize * 0.1; // margin
const firstPage = 1;
const lastPage = numPages;

function useTitlePositioning(page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) {
  // refs which are modified by this hook
  const containerRef = useRef<HTMLDivElement>();

  const scroll = useScroll();
  useFrame(() => {
    const currPage = 1 + scroll.offset / singlePageSize; // [1, 8]
    const isFirstPage = page === firstPage;
    const isLastPage = page === lastPage;
    const isEaseOut = isFirstPage || (currPage > page + 0.5 && !isLastPage);
    const sign = isEaseOut ? -1 : 1;

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

    const easeFunc =
      easingFunctions[
        isFirstPage
          ? 'easeOutQuint'
          : isLastPage
          ? 'easeInOutQuint'
          : isEaseOut
          ? 'easeOutQuint'
          : 'linear'
      ];

    const tEased = easeFunc(t);
    containerRef.current.style.transform = `translateY(${(1 - tEased) * sign * 100}vh)`;
  });

  return containerRef;
}

const titleStyles = {
  outer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    margin: '0 auto',
    padding: '1em 0.5em',
  },
  inner: {
    width: '90%',
    maxWidth: 800,
    margin: '0 auto',
  },
  title: {
    fontSize: '2em',
    fontWeight: 700,
    color: textColorDark,
    lineHeight: '1.1em',
  },
  subtitle: {
    width: '100%',
    fontSize: '1em',
    color: textColor,
    lineHeight: '1.25em',
  },
} as const;

const titleStylesBottom = {
  outer: {
    ...titleStyles.outer,
    padding: 0,
    top: '20vh', // note: linked to ease func for last page (determines how far it gets)
    left: '-45vw',
    width: '90vw',
    textAlign: 'center',
  },
  subtitle: {
    ...titleStyles.subtitle,
    width: '100%',
    lineHeight: '1.5em',
  },
} as const;

const emphasisStyle = {
  color: textColorDark,
  fontWeight: 700,
};

const friedStyle = emphasisStyle;
const unfriedStyle = { ...emphasisStyle, color: textColor };
const ratioStyle = { ...emphasisStyle, color: highlightColor };
const monospaceStyle = { fontFamily: 'monospace', letterSpacing: -0.5 };

const linkStyle = {
  verticalAlign: 'middle',
  display: 'inline-block',
};
const iconSize = '1.75em';

const htmlStyle = { fontSize: '2vh' };
// don't break scrolling
const htmlStyleNoPointerEvents = { ...htmlStyle, pointerEvents: 'none' } as const;
const htmlzIndexRange = [-1, -1]; // set behind canvas

const Title = forwardRef(
  (
    {
      title,
      subtitle,
      outerStyle = titleStyles.outer,
      innerStyle = titleStyles.inner,
      titleStyle = titleStyles.title,
      subtitleStyle = titleStyles.subtitle,
    }: {
      title: React.ReactNode;
      subtitle: React.ReactNode;
      outerStyle?: React.CSSProperties;
      innerStyle?: React.CSSProperties;
      titleStyle?: React.CSSProperties;
      subtitleStyle?: React.CSSProperties;
    },
    ref: React.RefObject<HTMLDivElement>,
  ) => (
    <div ref={ref} style={outerStyle}>
      <div style={innerStyle}>
        <div style={titleStyle}>{title}</div>
        <p style={subtitleStyle}>{subtitle}</p>
      </div>
    </div>
  ),
);

export default function Titles() {
  const one = useTitlePositioning(1);
  const two = useTitlePositioning(2);
  const three = useTitlePositioning(3);
  const four = useTitlePositioning(4);
  const five = useTitlePositioning(5);
  const six = useTitlePositioning(6);
  const seven = useTitlePositioning(7);
  const eight = useTitlePositioning(8);

  return (
    <>
      <Html
        prepend
        fullscreen
        occlude={false}
        zIndexRange={htmlzIndexRange}
        style={htmlStyleNoPointerEvents}
      >
        <Title
          ref={one}
          title="The fry universe 🍟"
          subtitle={
            <>
              You probably like some types of fries more than others. The 3D modeling of various fry
              shapes illuminates why this might be.
              <br />
              <br />
              <span style={friedStyle}>Scroll ⬇️ for more</span>.
            </>
          }
        />

        <Title
          ref={two}
          title="Intuition"
          subtitle={
            <>
              Intuitively you know that curly fries and straight up potatoes are very{' '}
              <em>different</em>. You might even prefer one to the other.
              <br />
              <br />
              <span style={emphasisStyle}>
                But <em>why</em> tho?
              </span>
            </>
          }
        />
        <Title
          ref={three}
          title="Fried potential"
          subtitle={
            <>
              It turns out that a key difference between fry forms is{' '}
              <span style={emphasisStyle}>how fried</span> they can be. To quantify this, fries were
              modeled in 3D to measure their <span style={friedStyle}>fried</span> and{' '}
              <span style={unfriedStyle}>unfried</span> portions:
            </>
          }
        />
        <Title
          ref={four}
          title="Visualizing fried vs unfried"
          subtitle={
            <>
              Using 3D model data, <span style={friedStyle}>fried</span> and{' '}
              <span style={unfriedStyle}>unfried</span> portions of fry shapes were visualized as
              nested circles:
            </>
          }
        />
        <Title
          ref={five}
          title="The fried universe"
          subtitle={
            <>
              Visualizing <span style={friedStyle}>fried</span> and{' '}
              <span style={unfriedStyle}>unfried</span> measurements across the fry universe shows
              they are each <strong>unique</strong>.
            </>
          }
        />
        <Title
          ref={six}
          title={
            <>
              The <span style={ratioStyle}>fried ratio</span>
            </>
          }
          subtitle={
            <>
              To more easily compare <span style={friedStyle}>fried</span>-ness across the universe,
              we can compute the{' '}
              <span style={monospaceStyle}>
                <span style={ratioStyle}>fried ratio</span> = (<span style={friedStyle}>fried</span>{' '}
                / <span style={unfriedStyle}>unfried</span>)
              </span>
            </>
          }
        />
        <Title
          ref={seven}
          title={
            <>
              The <span style={ratioStyle}>fried ratio</span>
            </>
          }
          subtitle={
            <>
              Plotting this <span style={ratioStyle}>fried ratio</span> = (
              <span style={friedStyle}>fried</span> / <span style={unfriedStyle}>unfried</span>)
              along the <span style={ratioStyle}>x-axis</span> shows that fry forms are vastly
              different. What's your favorite <span style={friedStyle}>fried</span> level?
            </>
          }
        />
      </Html>

      <Html transform={false}>
        <Title
          ref={eight}
          title="The fry universe 🍟"
          subtitle={
            <>
              What's your favorite fry shape?
              <br />
              <TwitterLink /> <FacebookLink /> or copy{' '}
              <Copy size={iconSize} text="https://www.chris-williams.me/fry-universe" /> to share.
            </>
          }
          outerStyle={titleStylesBottom.outer}
          subtitleStyle={titleStylesBottom.subtitle}
        />
      </Html>
    </>
  );
}

const iconMargin = { marginTop: '0.5em' };

function TwitterLink({ size = iconSize }) {
  return (
    <a
      href="https://twitter.com/intent/tweet?url=https://www.chris-williams.me/fry-universe&text="
      target="_blank"
      rel="noreferrer"
      style={linkStyle}
    >
      <div style={iconMargin}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4AA1EB"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 6C12 6.78793 11.8448 7.56815 11.5433 8.2961C11.2417 9.02405 10.7998 9.68549 10.2426 10.2426C9.68549 10.7998 9.02405 11.2417 8.2961 11.5433C7.56815 11.8448 6.78793 12 6 12C5.21207 12 4.43185 11.8448 3.7039 11.5433C2.97595 11.2417 2.31451 10.7998 1.75736 10.2426C1.20021 9.68549 0.758251 9.02405 0.456723 8.2961C0.155195 7.56815 -1.17411e-08 6.78793 0 6C2.37122e-08 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6ZM9.018 5.05C9.018 6.96 7.563 9.165 4.902 9.165C4.11703 9.16698 3.34858 8.93968 2.691 8.511C3.45589 8.60362 4.22628 8.38891 4.833 7.914C4.53116 7.90862 4.2386 7.80878 3.99645 7.62851C3.75429 7.44824 3.57473 7.19661 3.483 6.909C3.69996 6.95123 3.92372 6.94302 4.137 6.885C3.80946 6.81877 3.51492 6.64129 3.30331 6.38266C3.0917 6.12402 2.97606 5.80017 2.976 5.466V5.448C3.171 5.556 3.393 5.622 3.63 5.628C3.3227 5.42511 3.10481 5.1122 3.02111 4.7536C2.93741 4.395 2.99427 4.01797 3.18 3.7C3.5431 4.14719 3.99628 4.51293 4.51005 4.77343C5.02382 5.03394 5.58667 5.18337 6.162 5.212C6.0898 4.90209 6.12177 4.57701 6.25297 4.2871C6.38417 3.99719 6.60727 3.75862 6.88774 3.6083C7.16822 3.45799 7.49042 3.40432 7.80447 3.45561C8.11852 3.50689 8.40692 3.66027 8.625 3.892C8.94852 3.82783 9.25888 3.7095 9.543 3.542C9.43545 3.87719 9.20931 4.16164 8.907 4.342C9.201 4.306 9.48 4.228 9.738 4.114C9.54317 4.40472 9.29839 4.65864 9.015 4.864C9.018 4.924 9.018 4.987 9.018 5.05V5.05Z"
          />
        </svg>
      </div>
    </a>
  );
}

function FacebookLink({ size = iconSize }) {
  return (
    <a
      href="https://www.facebook.com/sharer/sharer.php?u=https://www.chris-williams.me/fry-universe"
      target="_blank"
      rel="noreferrer"
      style={linkStyle}
    >
      <div style={iconMargin}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#3E5593"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.662 0H11.338C11.5136 0 11.682 0.0697463 11.8061 0.193895C11.9303 0.318044 12 0.486427 12 0.662V11.338C12 11.5136 11.9303 11.682 11.8061 11.8061C11.682 11.9303 11.5136 12 11.338 12H8.276V7.36H9.84267V7.35733H9.85267L10.086 5.54067H8.286V4.384C8.286 3.95133 8.386 3.634 8.84133 3.53533C8.93667 3.51533 9.048 3.50467 9.176 3.50467H10.138V1.88267C9.67466 1.8349 9.20913 1.81153 8.74333 1.81267C8.68553 1.81247 8.62773 1.8138 8.57 1.81667C7.30533 1.88333 6.44733 2.68933 6.41467 4.12067C6.41411 4.14911 6.41389 4.17755 6.414 4.206V5.54267H4.852V7.35933H6.414V12H0.662C0.486427 12 0.318044 11.9303 0.193895 11.8061C0.0697463 11.682 0 11.5136 0 11.338V0.662C0 0.486427 0.0697463 0.318044 0.193895 0.193895C0.318044 0.0697463 0.486427 0 0.662 0V0Z"
          />
        </svg>
      </div>
    </a>
  );
}
