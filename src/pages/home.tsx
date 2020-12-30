import React from 'react';
import Page from '../components/Page';
import HomeBackground from '../components/HomeBackground';
import Link from 'next/link';
import { reds } from '../theme';

const BACKGROUND_SIZE = 840;

const HomePage = () => (
  <>
    <Page showNav={false} padding={false}>
      <HomeBackground />
      <div className="home">
        <div className="text-background" />
        <div className="content">
          <h2>Hi, my name is Chris Williams.</h2>
          <p>I currently craft data visualizations & interfaces at Airbnb.</p>
          <br />
          <div>
            <Link href="/about">About</Link>
          </div>
          <div>
            <Link href="/projects">Projects</Link>
          </div>
        </div>
      </div>
    </Page>
    <style jsx>{`
      .home {
        height: 100%;
        width: 100%;
        z-index: 1;
        font-size: 0.8rem;
      }
      .text-background {
        width: ${BACKGROUND_SIZE}px;
        height: ${BACKGROUND_SIZE}px;
        background: ${reds[0]}66;
        position: absolute;
        left: ${Math.floor(BACKGROUND_SIZE * 0.25)}px;
        top: -${Math.floor(BACKGROUND_SIZE * 0.25)}px;
        transform: translateX(-50%);
        border-radius: 50%;
        z-index: -1;
        pointer-events: none;
      }
      .content {
        max-width: ${Math.floor(BACKGROUND_SIZE * 0.64)}px;
        padding: 100px 40px;
        z-index: 0;
      }
      p {
        font-size: 1.25em;
        font-weight: 100;
      }
    `}</style>
  </>
);

export default HomePage;
