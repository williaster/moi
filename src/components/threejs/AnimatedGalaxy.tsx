import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import CanvasPage from './CanvasPage';

const controlsConfig = {
  innerColor: '#ffe100',
  outerColor: '#4e0085',
  count: {
    value: 1000,
    min: 100,
    max: 100000,
    step: 100,
  },
  size: {
    value: 70,
    min: 10,
    max: 200,
    step: 1,
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

export default function AnimatedGalaxy() {
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
    randomness,
    randomPower,
  } = useControls(controlsConfig);
  const galaxy = useMemo(
    () =>
      generateGalaxy({
        count,
        radius,
        branches,
        randomness,
        randomPower,
        innerColor,
        outerColor,
      }),
    [count, radius, branches, randomness, randomPower, innerColor, outerColor],
  );
  const { clock, gl } = useThree();
  const time = useRef({ value: 0 });
  useFrame(() => {
    time.current.value = clock.elapsedTime;
  });

  return (
    <>
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute attachObject={['attributes', 'position']} args={[galaxy.position, 3]} />
          <bufferAttribute attachObject={['attributes', 'color']} args={[galaxy.color, 3]} />
          <bufferAttribute attachObject={['attributes', 'aScale']} args={[galaxy.scales, 1]} />
          <bufferAttribute attachObject={['attributes', 'aRandomness']} args={[galaxy.random, 3]} />
        </bufferGeometry>
        <shaderMaterial
          key={Math.random()}
          vertexColors
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uSize: { value: size * gl.getPixelRatio() }, // scale size depending on pixel ratio
            uTime: time.current,
          }}
          vertexShader={`
            uniform float uSize;
            uniform float uTime;

            attribute float aScale;
            attribute vec3 aRandomness;

            varying vec3 vColor; 
            
            void main() {
              // position
              vec4 modelPosition = modelMatrix * vec4(position, 1.0);
              
              // increase angle based on time and distance from center
              float angle = atan(modelPosition.x, modelPosition.z);
              float distFromCenter = length(modelPosition.xz); // assumes centered in scene
              float offsetAngle = 1.0 / distFromCenter; // closer = faster, hence divide
              offsetAngle *= uTime * 0.1;
              float finalAngle = angle + offsetAngle;
              modelPosition.x = cos(finalAngle) * distFromCenter;
              modelPosition.z = sin(finalAngle) * distFromCenter;

              // randomness
              modelPosition.xyz += aRandomness;
              
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectedPosition = projectionMatrix * viewPosition;

              gl_Position = projectedPosition;

              // size
              gl_PointSize = uSize * aScale;

              // size attenuation, from src/../points_vert.glsl.js
              gl_PointSize /= -viewPosition.z;

              vColor = color;
            }
          `}
          fragmentShader={`
            varying vec3 vColor; 

            void main() {
              // diffuse disc
              float strength = distance(gl_PointCoord, vec2(0.5)); 
              strength *= 2.0; // *2 so it's 1.0 at edge
              strength = 1.0 - strength; // distance is 0 in center, but we want opposite
              strength = pow(strength, 5.0); // diffuse with power; bigger power = quicker dropoff
              vec3 color = mix(vec3(0.0), vColor, strength);

              gl_FragColor = vec4(color, strength);
            }  
          `}
        />
      </points>
    </>
  );
}

function generateGalaxy({
  count,
  radius: radiusConfig,
  branches,
  randomness,
  randomPower,
  innerColor,
  outerColor,
}) {
  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const scales = new Float32Array(count * 1);
  const random = new Float32Array(count * 3);

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

    // add randomness to each direction
    const randomX =
      Math.pow(Math.random(), randomPower) * (Math.random() > 0.5 ? 1 : -1) * randomness;
    const randomY =
      Math.pow(Math.random(), randomPower) * (Math.random() > 0.5 ? 1 : -1) * randomness;
    const randomZ =
      Math.pow(Math.random(), randomPower) * (Math.random() > 0.5 ? 1 : -1) * randomness;

    position[x] = Math.cos(branchAngle) * radius;
    position[y] = 0;
    position[z] = Math.sin(branchAngle) * radius;

    random[x] = randomX;
    random[y] = randomY;
    random[z] = randomZ;

    // mix color based on radius
    const mixingColor = innerColorObj.clone();
    mixingColor.lerp(outerColorObj, radius / radiusConfig);

    color[x] = mixingColor.r;
    color[y] = mixingColor.g;
    color[z] = mixingColor.b;

    // scale
    scales[i] = Math.random();
  }

  return { position, color, scales, random };
}
