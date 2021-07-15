/**
 * Notes
 * textures
 *  - wrapping/transforms, min/magFilters<>mipmapping, res = n^2, small size + res (all px go to gpu)
 *  - can disable mipmaps if using nearest filter
 *  - jpg no transparency but smaller size (normals typically png)
 *  - can encode multiple datum in one image using rgba (e.g. elevation + transparency)
 *
 * thoughts
 *  - try ToonMaterial with 5-px gradient map
 *
 */
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Leva, useControls, folder } from 'leva';
import getStaticUrl from '../../utils/getStaticUrl';
import CanvasPage from './CanvasPage';

export default function Basics() {
  return (
    <React.Suspense fallback={null}>
      <CanvasPage background="#222">
        <Canvas>
          <React.Suspense fallback={null}>
            <Scene />
            <axesHelper args={[2]} />
            {/* <OwnOrbitControls /> */}
          </React.Suspense>
        </Canvas>
        <Leva titleBar={false} />
      </CanvasPage>
    </React.Suspense>
  );
}

const clock = new THREE.Clock();

function MyTriangle() {
  const vertices = new Float32Array([0, 0, 0, 0, 0.5, 0, 0.5, 0, 0]);

  return (
    <mesh>
      <bufferGeometry attach="geometry">
        <bufferAttribute attachObject={['attributes', 'position']} args={[vertices, 3]} />
      </bufferGeometry>
      <meshBasicMaterial attach="material" color="yellow" side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene() {
  const mesh1 = useRef();
  const mesh2 = useRef();

  const controls = useControls({
    Cube1: folder({
      color: '#47597e',
      width: {
        value: 1.5,
        min: 0.5,
        max: 10,
        step: 0.5,
      },
      height: {
        value: 0.5,
        min: 0.5,
        max: 10,
        step: 0.5,
      },
      depth: {
        value: 0.5,
        min: 0.5,
        max: 10,
        step: 0.5,
      },
    }),
  });

  const doorTexture = useTexture(getStaticUrl('/static/images/threejs/color.jpg'));
  console.log(doorTexture);

  useFrame(() => {
    const curr = clock.getElapsedTime();
    mesh1.current.rotation.x = (curr * Math.PI) / 4;

    mesh2.current.rotation.y = (curr * Math.PI) / 4;
    mesh2.current.position.x = Math.sin(curr);
    mesh2.current.position.y = Math.cos(curr);
  });

  return (
    <>
      <group>
        <mesh ref={mesh1} position={[1.5, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <boxBufferGeometry args={[controls.width, controls.height, controls.depth]} />
          <meshBasicMaterial color={controls.color} />
        </mesh>
        <mesh ref={mesh2} position={[0, 0, 1]} rotation={[0, 0, 0]}>
          <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="#ff8474" />
        </mesh>

        <mesh position={[0, 0, 5]}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshBasicMaterial map={doorTexture} />
        </mesh>
      </group>
      <OrbitControls />
      <MyTriangle />
    </>
  );
}

function OwnOrbitControls() {
  useFrame(state => {
    state.camera.position.x = Math.sin(state.mouse.x * Math.PI * 2) * 5;
    state.camera.position.z = Math.cos(state.mouse.x * Math.PI * 2) * -5;
    state.camera.position.y = state.mouse.y * -10;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function getMousePos(e) {
  return { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
}
