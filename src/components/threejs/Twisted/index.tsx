import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Leva, useControls, folder } from 'leva';
import CanvasPage from '../CanvasPage';

export default function Basics() {
  const { background } = useControls({ background: '#4b0632' });
  return (
    <CanvasPage>
      <Canvas>
        <React.Suspense fallback={null}>
          <color attach="background" args={[background]} />
          <Scene />
          <OrbitControls />
          {/* <axesHelper /> */}
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}

function Scene() {
  const { size, subdivisions, wireframe, bend, rotation, speed } = useControls({
    size: { value: 5, min: 1, max: 50, step: 1 },
    subdivisions: { value: 1, min: 1, max: 10, step: 1 },
    bend: { value: 0.05, min: 0, max: 5, step: 0.001 },
    rotation: { value: 0.25, min: 0, max: 1, step: 0.05 },
    speed: { value: 0.25, min: 0, max: 2.5, step: 0.05 },
    wireframe: false,
  });
  const uTime = useRef({ value: 0 });
  useFrame(state => {
    const { elapsedTime } = state.clock;
    uTime.current.value = elapsedTime;
  });
  return (
    <>
      <group>
        <mesh position={[0, 0, size / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <boxBufferGeometry args={[1, size, 1, 1, size * subdivisions, 1]} />
          <shaderMaterial
            key={Math.random()}
            wireframe={wireframe}
            uniforms={{
              uTime: uTime.current,
              uBend: { value: bend },
              uRotation: { value: rotation },
              uSpeed: { value: speed },
              uSize: { value: size },
            }}
            vertexShader={`
              #define PI 3.14159265358
              
                vec2 rotate(vec2 uv, float rotation, vec2 mid) {
                    return vec2(
                        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
                        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
                    );
                }

                uniform float uTime;
                uniform float uSpeed;
                uniform float uBend;
                uniform float uRotation;
                uniform float uSize;

                varying vec2 vUv;

                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


                    // modelPosition.xy = rotate(
                    //     modelPosition.xy, 
                    //     uBend * modelPosition.z, 
                    //     vec2(modelPosition.z, modelPosition.z)
                    // );

                    // rotate each x/y based on z
                    modelPosition.xy = rotate(
                        modelPosition.xy, 
                        PI * uRotation * modelPosition.z + uTime * uSpeed, 
                        vec2(0.0, 0.0)
                    );


                    // make an arc
                    modelPosition.x += sin(PI * (modelPosition.z / uSize)) * uBend;

                    modelPosition.xy = rotate(
                        modelPosition.xy, 
                        -0.5 * PI * cos(modelPosition.z / uSize), 
                        vec2(modelPosition.x -1.0, modelPosition.y)
                    );

                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;

                    gl_Position = projectedPosition;
                    vUv = uv;
                }
            `}
            fragmentShader={`
                varying vec2 vUv;
                
                void main() {
                    gl_FragColor = vec4(vUv, 0.5, 1.0);
                }
            `}
          />
        </mesh>
      </group>
    </>
  );
}
