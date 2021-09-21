import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls, Reflector } from '@react-three/drei';

import Contours from '../components/Contours';
import Page from '../components/Page';

const background = '#fff';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight intensity={0.5} color="#fff" position={[0, 0, 100]} />
      <Contours />
    </>
  );
}

function ContoursPage() {
  return (
    <>
      <Page centerContent={false} showNav={false} padding={false}>
        <div className="canvas">
          <Canvas
            shadowMap
            camera={{ position: [0, 0, 200], fov: 100 }}
            // onCreated={canvas => canvas.gl.setClearColor(background)}
          >
            <Scene />
            <OrbitControls listenToKeyEvents={false} />
          </Canvas>
        </div>
      </Page>

      <style global jsx>{`
        .main {
          overflow: hidden;
          background: ${background};
          justify-content: flex-start;
        }

        .canvas,
        canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default ContoursPage;
