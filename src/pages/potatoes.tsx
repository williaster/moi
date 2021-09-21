import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import Page from '../components/Page';
import Potato from '../components/potatoes/Potato';
import Wedge from '../components/potatoes/Wedge';
import Tot from '../components/potatoes/Tot';
import Fry from '../components/potatoes/Fry';
import Curly from '../components/potatoes/Curly';
import Waffle from '../components/potatoes/Waffle';
import Ridged from '../components/potatoes/Ridged';

const PotatoesPage = () => (
  <>
    <Page showNav={false}>
      Potatoes
      <br />
      <div className="canvas">
        <Canvas camera={{ fov: 40, position: [0, 0, 10] }}>
          <React.Suspense fallback={null}>
            <OrbitControls />
            <Scene />
          </React.Suspense>
        </Canvas>
      </div>
    </Page>
    <style global jsx>{`
      .main {
        height: 100%;
        width: 100%;
        font-size: 0.8rem;
        background: #987a79;
        color: white;
      }
      p {
        font-size: 1.25em;
        font-weight: 100;
      }
      .canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
      }
    `}</style>
  </>
);

function Scene() {
  return (
    <>
      <Potato position={[-3, 0, 0]} />
      <Wedge position={[-2, 0, 0]} />
      <Tot position={[-1, 0, 0]} />
      <Fry position={[0, 0, 0]} />
      <Curly position={[1, 0, 0]} />
      <Waffle position={[2, 0, 0]} />
      <Ridged position={[3, 0, 0]} />
    </>
  );
}

export default PotatoesPage;
