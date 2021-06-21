import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import CanvasPage from './CanvasPage';

const controlsConfig = {
  innerColor: '#47597e',
  outerColor: '#7094dc',
  count: {
    value: 1000,
    min: 100,
    max: 100000,
    step: 100,
  },
  size: {
    value: 0.02,
    min: 0.01,
    max: 1,
    step: 0.01,
  },
  radius: {
    value: 5,
    min: 0.01,
    max: 20,
    step: 0.01,
  },
  branches: {
    value: 3,
    min: 2,
    max: 20,
    step: 1,
  },
  spin: {
    value: 1,
    min: -3,
    max: 3,
    step: 0.001,
  },
  randomness: {
    value: 1,
    min: 0,
    max: 2,
    step: 0.001,
  },
  randomPower: {
    value: 2,
    min: 1,
    max: 10,
    step: 0.001,
  },
};

export default function Galaxy() {
  return (
    <CanvasPage background="#1c122b">
      <Canvas>
        <React.Suspense fallback={null}>
          <Scene />
          <OrbitControls listenToKeyEvents={false} />
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}

function Scene() {
  const {
    branches,
    innerColor,
    outerColor,
    count,
    size,
    radius,
    spin,
    randomness,
    randomPower,
  } = useControls(controlsConfig);
  const galaxy = useMemo(
    () =>
      generateGalaxy({
        count,
        radius,
        branches,
        spin,
        randomness,
        randomPower,
        innerColor,
        outerColor,
      }),
    [count, radius, branches, spin, randomness, randomPower, innerColor, outerColor],
  );

  return (
    <>
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute attachObject={['attributes', 'position']} args={[galaxy.position, 3]} />
          <bufferAttribute attachObject={['attributes', 'color']} args={[galaxy.color, 3]} />
        </bufferGeometry>
        <pointsMaterial
          sizeAttenuation
          vertexColors
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={size}
        />
      </points>
    </>
  );
}

function generateGalaxy({
  count,
  radius: radiusConfig,
  branches,
  spin,
  randomness,
  randomPower,
  innerColor,
  outerColor,
}) {
  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);

  const innerColorObj = new THREE.Color(innerColor);
  const outerColorObj = new THREE.Color(outerColor);

  for (let i = 0; i < count; i += 1) {
    // indices
    const i3 = i * 3;
    const x = i3;
    const y = i3 + 1;
    const z = i3 + 2;

    // angle + position
    const radius = Math.random() * radiusConfig;
    const branch = i % branches;
    const branchAngle = (branch / branches) * Math.PI * 2;
    const spinAngle = radius * spin; // increase going outward

    // add randomness to each direction
    const randomX =
      Math.pow(Math.random(), randomPower) * (Math.random() > 0.5 ? 1 : -1) * randomness;
    const randomY =
      Math.pow(Math.random(), randomPower) * (Math.random() > 0.5 ? 1 : -1) * randomness;
    const randomZ =
      Math.pow(Math.random(), randomPower) * (Math.random() > 0.5 ? 1 : -1) * randomness;

    position[x] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    position[y] = randomY;
    position[z] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // mix color based on radius
    const mixingColor = innerColorObj.clone();
    mixingColor.lerp(outerColorObj, radius / radiusConfig);

    color[x] = mixingColor.r;
    color[y] = mixingColor.g;
    color[z] = mixingColor.b;
  }

  return { position, color };
}
