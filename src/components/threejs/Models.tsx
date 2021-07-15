import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import CanvasPage from './CanvasPage';
import getStaticUrl from '../../utils/getStaticUrl';
import DuckModel from './models/DuckModel';
import Belo from './models/Belo';

export default function Models() {
  return (
    <CanvasPage background="#080024">
      <Canvas shadowMap camera={{ fov: 40, position: [-30, 20, 80] }}>
        <React.Suspense fallback={null}>
          <Scene />
          <OrbitControls listenToKeyEvents={false} />
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}

function Duck(props: JSX.IntrinsicElements['group']) {
  const duck = useLoader(GLTFLoader, getStaticUrl('/static/Models/Duck/glTF/Duck.gltf'));
  //   console.log('Duck', duck.scene.children[0].children[1]);
  return (
    <group scale={[0.01, 0.01, 0.01]} {...props}>
      <primitive object={duck.scene.children[0].children[1]} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight castShadow intensity={0.5} color="#0ff" position={[5, 5, -5]} />
      <pointLight castShadow intensity={1} color="#ffff8f" position={[15, 15, -25]} />
      <mesh receiveShadow position={[0, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[150, 150]} />
        <meshPhongMaterial side={THREE.DoubleSide} color="#3c494d" reflectivity={1} />
      </mesh>
      <Duck position={[-0.5, 0, -0.75]} />
      <DuckModel position={[1.5, 0, 1.75]} rotation={[0, Math.PI / 2, 0]} />
      <Belo position={[0.7, 0.25, 0.5]} />
    </>
  );
}
