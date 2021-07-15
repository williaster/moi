import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';

import CanvasPage from '../CanvasPage';
import ShootingStars from './ShootingStars';
import FlyingObject from './FlyingObject';
import Effects from './Effects';

export default function Flying() {
  const { background } = useControls({ background: '#4e344e' });
  return (
    <CanvasPage>
      <Canvas
        shadowMap
        camera={{ position: [0, 0, -15] }}
        gl={{ stencil: false, depth: false, alpha: false, antialias: false }}
      >
        <React.Suspense fallback={null}>
          <color attach="background" args={[background]} />
          <Scene />
          <Effects />
          <OrbitControls maxDistance={50} />
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}

function Scene() {
  const pointLightRef = useRef();
  const { speed, starCount } = useControls({
    speed: { value: 100, min: 0, max: 200 },
    starCount: { value: 100, min: 0, max: 1000, step: 1 },
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight
        ref={pointLightRef}
        castShadow
        intensity={0.5}
        color="#0ff"
        position={[3, 10, 0]}
        shadow-mapSize={[3 * 1024, 3 * 1024]}
        shadow-normalBias={0.05}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      {/* {pointLightRef.current && <cameraHelper args={[pointLightRef.current.shadow.camera]} />}} */}
      <ShootingStars speed={speed} count={starCount} />
      <FlyingObject speed={speed} />
    </>
  );
}
