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
import { backgroundColor, textColor } from '../components/potatoes/colors';
import Title from '../components/potatoes/Title';

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
      <Title />
      <FriedAxis />
      <RidgedComplete />
      <WaffleComplete />
      <CurlyComplete />
      <FryComplete />
      <TotComplete />
      <WedgeComplete />
      <PotatoComplete />

      <ambientLight />
      <directionalLight
        position={[-10, 3, 10]}
        rotation={[Math.PI * 0.25, Math.PI, Math.PI * 0]}
        args={[backgroundColor, 1]}
      />
    </ScrollControls>
  );
}

export default PotatoesPage;
