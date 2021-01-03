import React from 'react';
import Page from '../components/Page';
import HomeBackground from '../components/HomeBackground';
import Link from 'next/link';
import { blues, reds } from '../theme';
import BackgroundCircle from '../components/BackgroundCircle';

const BACKGROUND_SIZE = 800;

const HomePage = () => (
  <>
    <Page showNav={false} padding={false}>
      <HomeBackground />
      <div className="home">
        <BackgroundCircle fixedSize color={`${reds[0]}66`} />
        <BackgroundCircle position="bottom" color={`${blues[blues.length - 1]}22`} />
        <div className="content">
          <h2>Hi, my name is Chris Williams.</h2>
          <p>I currently craft all sorts of data visualizations & interfaces at Airbnb.</p>
          <div>
            <Link href="/projects">Projects</Link>
          </div>
          <div>
            <Link href="/about">About</Link>
          </div>
        </div>
      </div>
    </Page>
    <style jsx>{`
      .home {
        height: 100%;
        width: 100%;
        font-size: 0.8rem;
      }
      .content {
        position: relative;
        max-width: ${Math.floor(BACKGROUND_SIZE * 0.64)}px;
        padding: 100px 40px;
        z-index: 1;
      }
      p {
        font-size: 1.25em;
        font-weight: 100;
      }
    `}</style>
  </>
);

export default HomePage;
