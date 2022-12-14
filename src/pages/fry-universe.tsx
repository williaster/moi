import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, ScrollControls, Scroll } from '@react-three/drei';

import Page from '../components/Page';
import Loader from '../components/fry-universe/Loader';
import Background from '../components/fry-universe/Background';
import FriedAxis from '../components/fry-universe/FriedAxis';
import { backgroundColor, textColor } from '../components/fry-universe/colors';
import Title from '../components/fry-universe/Title';
import { cssFontRules, FontUriLinks } from '../components/fry-universe/font';
import * as colors from '../components/fry-universe/colors';
import Labels from '../components/fry-universe/Labels';
import Curly from '../components/fry-universe/models/Curly';
import Potato from '../components/fry-universe/models/Potato';
import Ridged from '../components/fry-universe/models/Ridged';
import Waffle from '../components/fry-universe/models/Waffle';
import Fry from '../components/fry-universe/models/Fry';
import Tot from '../components/fry-universe/models/Tot';
import Wedge from '../components/fry-universe/models/Wedge';
import MorphingPotato from '../components/fry-universe/MorphingPotato';

const PotatoesPage = () => (
  <>
    <Page
      title="The fry universe 🍟"
      description="3D modeling of various fry shapes reveals why you like some more than others."
      previewImgUrl="https://raw.githubusercontent.com/williaster/moi/gh-pages/static/images/fry-universe/site-preview.png"
      previewImgDescription="Image of the fry universe orbiting"
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
        z-index: 10;
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
    <ScrollControls damping={10} pages={8}>
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
      <MorphingPotato />
    </ScrollControls>
  );
}

export default PotatoesPage;
