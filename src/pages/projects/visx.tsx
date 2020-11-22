import React from 'react';
import Page from '../../components/Page';

function Visx() {
  return (
    <>
      <Page>
        <div className="img" />
        <div className="content">
          <div>
            <h1>visx</h1>
            <div>tags tags tags</div>
            <p>
              At Airbnb, we made it a goal to unify our visualization stack across the company, and
              in the process we created a new project that brings together the power of D3 with the
              joy of React. Here are the advantages of visx:
            </p>
            <ul>
              <li>
                <strong>Keep bundle sizes down</strong> visx is split into multiple packages. Start
                small and use only what you need.
              </li>
              <li>
                <strong>Un-opinionated on purpose.</strong> Bring your own state management,
                animation library, or CSS-in-JS solution. Odds are good your React app already has
                an opinion on how animation, theming, or styling is done. visx is careful not to add
                another one and integrates with all of them.
              </li>
              <li>
                <strong>Not a charting library.</strong> As you start using visualization
                primitives, you’ll end up building your own charting library that’s optimized for
                your use case. You’re in control.
              </li>
            </ul>

            <p>
              And most importantly — it’s just React. If you know React, you can make
              visualizations. It’s all the same standard APIs and familiar patterns. visx should
              feel at home in any React codebase. We’re excited to see what you build with it!
            </p>
          </div>
          <div className="aside">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </div>
      </Page>
      <style jsx>{`
        .img {
          min-height: 400px;
          background-color: #000;
          background-image: url('/static/images/visx/hero-dark.png');
          background-size: auto;
          background-position: center;
          background-repeat: no-repeat;
        }
        .content {
          display: flex;
          flex-direction: row;
        }
        .content li {
          list-style-type: disc;
        }
        .content ul {
          padding-left: 18px;
        }
        .aside {
          flex-shrink: 0;
          margin-top: 3rem;
          margin-left: 32px;
          width: 30%;
        }
        @media (max-width: 600px) {
          .content {
            flex-direction: column-reverse;
          }
          .img {
            width: 100%;
            margin: 0;
          }
          .aside {
            width: 100%;
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}

export default Visx;
