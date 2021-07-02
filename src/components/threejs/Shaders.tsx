import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';

import CanvasPage from './CanvasPage';
// import vertexShader from 'raw-loader!glslify-loader!./shaders/vertexShader.glsl';

/**
 * Notes
 *
 * shaders
 *   *vertex* shader determines position of each vertex
 *   *fragment* shader determines the color of each vertex
 *
 * vocab
 *   *attributes* data that may vary per-vertex (only in vertex shader)
 *   *uniforms* data that is constant across vertices (e.g., camera position)
 *     - useful for diff results with same shader
 *     - enables tweaking or animating values
 *   *varying* value that vertex shader sends fragment shader, is interpolated between vertices
 *
 * why?
 *   - three.js textures are limited
 *   - can be simple + optimized
 *   - can use to do post-processing
 *
 * ShaderMaterial (abstracts some things for you) + RawShaderMaterial
 *
 * matrices
 *   *modelMatrix* transformations relative to the mesh (position, rotation, scale)
 *   *viewMatrix* transformations relative to the camera (position, rotation, fov, near, far)
 *   *projectionMatrix* transformations into clip space
 *   *modelViewMatrix* can use instead of model + view
 *
 */

function Scene() {
  const meshRef = useRef<THREE.Mesh>();
  const { frequencyX, frequencyY } = useControls({
    frequencyX: { value: 10, min: 0, max: 20, step: 0.1 },
    frequencyY: { value: 10, min: 0, max: 20, step: 0.1 },
  });

  const { clock } = useThree();
  const uTime = useRef({ value: 0 });
  useFrame(() => {
    uTime.current.value = clock.elapsedTime;
  });

  const divisions = 32;

  return (
    <>
      <ambientLight intensity={0.5} />
      <mesh ref={meshRef} receiveShadow castShadow position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <planeBufferGeometry args={[1, 1, divisions, divisions]}>
          <bufferAttribute
            attachObject={['attributes', 'aRandom']}
            // ideally could use geometry.attributes.position.count
            // else it's 6 vertices per triangle
            args={[new Float32Array(2 * divisions ** 2).map(() => Math.random()), 1]}
          />
        </planeBufferGeometry>

        <rawShaderMaterial
          wireframe
          wireframeLinewidth={4}
          key={Math.random()}
          side={THREE.DoubleSide}
          uniforms={{
            uFrequency: { value: new THREE.Vector2(frequencyX, frequencyY) },
            uTime: uTime.current,
          }}
          vertexShader={`
            uniform mat4 projectionMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 modelMatrix;
            uniform vec2 uFrequency;
            uniform float uTime;

            attribute vec3 position;
            attribute float aRandom;

            varying float vRandom;

            void main() {
              vec4 modelPosition = modelMatrix * vec4(position, 1.0);
              modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
              modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
              
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectionPosition = projectionMatrix * viewPosition;
              
              gl_Position = projectionPosition;
              vRandom =  modelPosition.z;
            }
          `}
          fragmentShader={`
            // vs lowp/highp 
            precision mediump float;

            varying float vRandom;
            
            void main () {
              gl_FragColor = vec4(vRandom * 5.0, 0.5, 0.5, 1.0);
            }
          `}
        />
      </mesh>
    </>
  );
}

export default function Shaders() {
  return (
    <CanvasPage background="#eee">
      <Canvas shadowMap camera={{ fov: 60 }}>
        <React.Suspense fallback={null}>
          <Scene />
          <OrbitControls listenToKeyEvents={false} />
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}
