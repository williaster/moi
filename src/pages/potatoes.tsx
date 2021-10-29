import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Stats, ScrollControls, Scroll } from '@react-three/drei';

import Page from '../components/Page';
import Loader from '../components/potatoes/Loader';
import {
  CurlyComplete,
  PotatoComplete,
  RidgedComplete,
  WedgeComplete,
  TotComplete,
  FryComplete,
  WaffleComplete,
} from '../components/potatoes/Layout';
import Background from '../components/potatoes/Background';
import FriedAxis from '../components/potatoes/FriedAxis';
import { backgroundColor, textColorDark, textColor } from '../components/potatoes/colors';

const PotatoesPage = () => (
  <>
    <Page centerContent={false} showNav={false}>
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
          <Stats className="stats" />
        </Canvas>
        <Loader />
      </div>
    </Page>
    <style global jsx>{`
      .main {
        height: 100%;
        width: 100%;
        font-size: 0.8rem;
        background: ${backgroundColor};
        color: ${textColor};
        overflow: hidden;
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

function Scene() {
  return (
    <ScrollControls damping={5} pages={7}>
      <Scroll html>
        <div style={{ padding: 32, lineHeight: '1em', fontSize: '2vh' }}>
          <div
            style={{
              fontSize: '2em',
              fontWeight: 700,
              padding: '0.5em 0 0',
              color: textColorDark,
            }}
          >
            Potato ranks 🥔
          </div>
          <p style={{ color: textColor, lineHeight: '1.2em' }}>
            3D modeling of various potato forms enabled ranking by a quantitative heuristic:{' '}
            <strong style={{ color: textColorDark }}>the fried ratio</strong>.
          </p>
        </div>
        <h1 style={{ position: 'absolute', left: 32, top: '100vh' }}>2nd page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '200vh' }}>3rd page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '300vh' }}>4th page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '400vh' }}>5th page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '500vh' }}>6th page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '600vh' }}>7th page</h1>
      </Scroll>
      <FriedAxis />
      <RidgedComplete />
      <WaffleComplete />
      <CurlyComplete />
      <FryComplete />
      <TotComplete />
      <WedgeComplete />
      <PotatoComplete />

      {/* <ambientLight />
      <directionalLight
        position={[-10, 3, 10]}
        rotation={[Math.PI * 0.25, Math.PI, Math.PI * 0]}
        args={[backgroundColor, 1]}
      /> */}
    </ScrollControls>
  );
}

export default PotatoesPage;
