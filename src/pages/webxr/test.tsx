import React from 'react';
import { ARCanvas } from '@react-three/xr';

import CanvasPage from '../../components/threejs/CanvasPage';
import { OrbitControls } from '@react-three/drei';

export default function TestPage() {
  return (
    <CanvasPage background="transparent">
      <ARCanvas>
        <Scene />
        <OrbitControls />
      </ARCanvas>
    </CanvasPage>
  );
}

function Scene() {
  return (
    <>
      <axesHelper />
      <mesh position={[0, 0, -10]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>
    </>
  );
}
