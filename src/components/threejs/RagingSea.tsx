import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';

import CanvasPage from './CanvasPage';
import threeDPerlinNoise from 'raw-loader!glslify-loader!./shaders/3dPerlinNoise.glsl';

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

function Scene() {
  const planeDivisions = 512;
  const {
    bigHeight,
    smallHeight,
    bigFrequencyX,
    bigFrequencyY,
    smallFrequency,
    bigSpeed,
    smallSpeed,
    shallowColor,
    deepColor,
    colorMultiplier,
    colorOffset,
  } = useControls({
    bigHeight: { value: 0.2, min: 0, max: 1, step: 0.01 },
    smallHeight: { value: 0.2, min: 0, max: 1, step: 0.01 },
    bigFrequencyX: { value: 10, min: 0, max: 20, step: 0.1 },
    bigFrequencyY: { value: 10, min: 0, max: 20, step: 0.1 },
    smallFrequency: { value: 5, min: 0, max: 20, step: 0.1 },
    bigSpeed: { value: 0.75, min: 0, max: 4, step: 0.1 },
    smallSpeed: { value: 0.75, min: 0, max: 4, step: 0.1 },
    shallowColor: '#0da2ff',
    deepColor: '#005c94',
    colorMultiplier: { value: 1, min: 0, max: 10, step: 0.1 },
    colorOffset: { value: 0.25, min: 0, max: 1, step: 0.01 },
  });
  const { clock } = useThree();
  const time = useRef({ value: 0 });
  useFrame(() => {
    time.current.value = clock.elapsedTime;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight castShadow intensity={0.5} color="#0ff" position={[5, 5, -5]} />
      <mesh position={[0, 0, 0]}>
        <planeBufferGeometry args={[1, 1, planeDivisions, planeDivisions]} />
        <shaderMaterial
          key={Math.random()}
          side={THREE.DoubleSide}
          uniforms={{
            time: time.current,
            bigWaveHeight: { value: bigHeight },
            bigWaveSpeed: { value: bigSpeed },
            smallWaveHeight: { value: smallHeight },
            smallWaveSpeed: { value: smallSpeed },
            smallWaveFreq: { value: smallFrequency },
            bigWaveFreq: { value: new THREE.Vector2(bigFrequencyX, bigFrequencyY) },
            shallowColor: { value: new THREE.Color(shallowColor) },
            deepColor: { value: new THREE.Color(deepColor) },
            colorMultiplier: { value: colorMultiplier },
            colorOffset: { value: colorOffset },
          }}
          vertexShader={`
            ${threeDPerlinNoise}
            uniform float time;
            uniform float bigWaveHeight;
            uniform float bigWaveSpeed;
            uniform float smallWaveHeight;
            uniform float smallWaveSpeed;
            uniform float smallWaveFreq;
            uniform vec2 bigWaveFreq;
            
            varying float vElevation;
            
            void main() {
              vec4 modelPosition = modelMatrix * vec4(position, 1.0);

              float elevation = 
                sin(modelPosition.x * bigWaveFreq.x + time * bigWaveSpeed) *
                sin(modelPosition.y * bigWaveFreq.y + time * bigWaveSpeed) * 
                bigWaveHeight;
            
              float height = 0.0;
              float freq = 0.0;
              float smallWaves = 0.0;
              
              for (float i = 1.0; i <= 3.0; i += 1.0) {
                height = smallWaveHeight / i;
                freq = smallWaveFreq * i;
                smallWaves = cnoise(vec3(modelPosition.xy * freq, time * smallWaveSpeed)) * height;
                elevation -= abs(smallWaves);
              }

              
              modelPosition.z += elevation;

              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectedPosition = projectionMatrix * viewPosition;

              gl_Position = projectedPosition;
              vElevation = elevation;
            }
          `}
          fragmentShader={`
            uniform vec3 shallowColor;
            uniform vec3 deepColor;
            uniform float colorMultiplier;
            uniform float colorOffset;
            
            varying float vElevation;
            
            void main() {
              float mixStrength = vElevation * colorMultiplier + colorOffset;
              vec3 color = mix(deepColor, shallowColor, mixStrength);

              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>
    </>
  );
}
