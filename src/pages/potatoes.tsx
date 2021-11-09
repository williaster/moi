import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Stats, ScrollControls, Scroll } from '@react-three/drei';

import Page from '../components/Page';
import Loader from '../components/potatoes/Loader';
import Background from '../components/potatoes/Background';
import FriedAxis from '../components/potatoes/FriedAxis';
import { backgroundColor, textColor } from '../components/potatoes/colors';
import Title from '../components/potatoes/Title';
import { cssFontRules, FontUriLinks } from '../components/potatoes/font';
import Labels from '../components/potatoes/Labels';
import Curly from '../components/potatoes/Curly';
import Potato from '../components/potatoes/Potato';
import * as colors from '../components/potatoes/colors';
import Ridged from '../components/potatoes/Ridged';
import Waffle from '../components/potatoes/Waffle';
import Fry from '../components/potatoes/Fry';
import Tot from '../components/potatoes/Tot';
import Wedge from '../components/potatoes/Wedge';

const PotatoesPage = () => (
  <>
    <Page
      title="Potato ranks 🥔"
      previewImgUrl="https://raw.githubusercontent.com/williaster/moi/gh-pages/static/site-preview-potatoes.png"
      description="Quantitative ranking of different potato forms"
      centerContent={false}
      showNav={false}
    >
      <Background />
      <div className="canvas">
        <Canvas
          orthographic
          camera={{ near: -300, far: 300, zoom: 3 }}
          gl={{ antialias: true }}
          dpr={Math.max(typeof window === 'undefined' ? 2 : window.devicePixelRatio, 2)}
        >
          <React.Suspense fallback={null}>
            <Scene />
          </React.Suspense>
          {typeof window !== 'undefined' && window.location.search.includes('stats') && (
            <Stats className="stats" />
          )}
        </Canvas>
        <Loader />
      </div>
    </Page>
    <FontUriLinks />
    <style global jsx>{`
      .main {
        ${cssFontRules}
        height: 100%;
        width: 100%;
        background: ${backgroundColor};
        color: ${textColor};
        overflow: hidden;
      }
      p {
        margin-top: 0.6em;
        margin-bottom: 0.5em;
      }
      .page {
        padding: 0;
      }
      .canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
      }
      .stats {
        top: initial !important;
        left: initial !important;
        bottom: 0;
        right: 0;
      }
    `}</style>
  </>
);

const potatoProps = {
  stroke: colors.textColorDark,
  fill: colors.backgroundColorDark,
  labelColor: colors.textColorDarker,
  fontSize: 2,
} as const;

function Scene() {
  return (
    <ScrollControls damping={3} pages={7}>
      <Title />
      <FriedAxis />
      <Labels />
      <Ridged {...potatoProps} />
      <Waffle {...potatoProps} />
      <Curly {...potatoProps} />
      <Fry {...potatoProps} />
      <Tot {...potatoProps} />
      <Wedge {...potatoProps} />
      <Potato {...potatoProps} />
    </ScrollControls>
  );
}

export default PotatoesPage;
