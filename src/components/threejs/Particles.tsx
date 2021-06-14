import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Leva, useControls, folder } from 'leva';
import getStaticUrl from '../../utils/getStaticUrl';
import CanvasPage from './CanvasPage';

export default function Particles() {
  return (
    <CanvasPage background="#080024">
      <Canvas camera={{ position: [0, 0, -10] }}>
        <React.Suspense fallback={null}>
          <Scene />
          <OrbitControls listenToKeyEvents={false} />
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}

function Scene({ particleCount = 5000 }) {
  const particleGeomRef = useRef();
  const particleTexture = useTexture(getStaticUrl('/static/images/threejs/particles/2.png'));

  const particles = useMemo(() => {
    const vertices = new Float32Array(3 * particleCount);
    const colors = new Float32Array(3 * particleCount);

    for (let i = 0; i < vertices.length; i += 1) {
      vertices[i] = (Math.random() - 0.5) * 15;
      colors[i] = (i % 3 === 0 ? 0.2 : i % 2 === 0 ? 1 : 0.5) * Math.random();
    }

    return { colors, vertices };
  }, []);

  const three = useThree();

  useFrame(() => {
    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const x = i3;
      const y = i3 + 1;
      const z = i3 + 2;
      const xVal = particleGeomRef.current.attributes.position.array[x];
      const yVal = particleGeomRef.current.attributes.position.array[y];
      const zVal = particleGeomRef.current.attributes.position.array[z];

      // shouldn't actually do this, should use a custom shader
      particleGeomRef.current.attributes.position.array[y] =
        0.5 * Math.sin(three.clock.elapsedTime + xVal) +
        0.5 * Math.cos(three.clock.elapsedTime + zVal);

      particleGeomRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* <ambientLight intensity={0.5} /> */}
      <points>
        <pointsMaterial
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          //   depthTest={false}
          //   alphaTest={0.001}
          size={0.15}
          //   color="#00a09e"
          vertexColors={true}
          alphaMap={particleTexture}
        />
        <bufferGeometry ref={particleGeomRef} attach="geometry">
          <bufferAttribute
            attachObject={['attributes', 'position']}
            args={[particles.vertices, 3]}
          />
          <bufferAttribute attachObject={['attributes', 'color']} args={[particles.colors, 3]} />
        </bufferGeometry>
      </points>
      {/* <mesh>
        <meshBasicMaterial color="yellow" />
        <boxBufferGeometry args={[1, 1, 1]} />
      </mesh> */}
      {/* <mesh position={[1, 1, 1]}>
        <meshBasicMaterial color="pink" />
        <boxBufferGeometry args={[1, 1, 1]} />
      </mesh> */}
    </>
  );
}
