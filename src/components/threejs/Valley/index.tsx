import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';

import CanvasPage from '../CanvasPage';
import terrainVertex from 'raw-loader!glslify-loader!./shaders/terrainVertex.glsl';
import terrainFragment from 'raw-loader!glslify-loader!./shaders/terrainFragment.glsl';
import perlin2d from 'raw-loader!glslify-loader!./shaders/perlin2d.glsl';

const textureStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10,
  width: 32,
  height: 128,
} as const;

export default function Valley() {
  const { background, lineCount, bigLineSize, smallLineSize, smallLineAlpha } = useControls({
    background: '#080008',
    lineCount: { value: 5, min: 1, max: 10, step: 1 },
    bigLineSize: { value: 0.04, min: 0.01, max: 0.1, step: 0.01 },
    smallLineSize: { value: 0.01, min: 0.01, max: 0.1, step: 0.01 },
    smallLineAlpha: { value: 0.5, min: 0.05, max: 1, step: 0.05 },
  });

  const canvasRef = useRef<HTMLCanvasElement>();
  const [canvasTextureRef, setCanvasTextureRef] = useState<THREE.CanvasTexture>();

  // @TODO move to own component
  useEffect(() => {
    const smallLineCount = lineCount - 1;
    const smallLineOffset = Math.round(textureStyles.height / lineCount);
    const actualBigLineWidth = Math.round(textureStyles.height * bigLineSize);
    const actualSmallLineWidth = Math.round(textureStyles.height * smallLineSize);

    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, textureStyles.width, textureStyles.height);

    // thick line
    // rainbow comes from red channel of color
    context.fillStyle = '#fff';
    context.globalAlpha = 1;
    context.fillRect(0, 0, textureStyles.width, actualBigLineWidth);

    // thin lines

    for (let i = 0; i < smallLineCount; i += 1) {
      context.fillStyle = `#${(i * 2).toString(16)}ff`;
      context.globalAlpha = smallLineAlpha;
      context.fillRect(
        0,
        actualBigLineWidth + smallLineOffset * (i + 1), // no blurry pixels
        textureStyles.width,
        actualSmallLineWidth,
      );
    }

    const texture = new THREE.CanvasTexture(canvasRef.current);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter; // zoomed in less blurry

    setCanvasTextureRef(texture);
  }, [canvasRef.current, lineCount, bigLineSize, smallLineSize, smallLineAlpha]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={textureStyles}
        width={textureStyles.width}
        height={textureStyles.height}
      />
      <CanvasPage>
        {canvasTextureRef && (
          <Canvas
            shadowMap
            gl={{ outputEncoding: THREE.sRGBEncoding, antialias: false }}
            camera={{ fov: 40, position: [-30, 20, 80] }}
          >
            <React.Suspense fallback={null}>
              <color attach="background" args={[background]} />
              <Scene texture={canvasTextureRef} />
              <OrbitControls listenToKeyEvents={false} />
              <Effects />
            </React.Suspense>
          </Canvas>
        )}
        <Leva titleBar={false} />
      </CanvasPage>
    </>
  );
}

function Scene({
  planeDivisions = 500,
  scale = 10,
  texture,
}: {
  planeDivisions?: number;
  scale?: number;
  texture?: THREE.CanvasTexture;
}) {
  const { elevation, step } = useControls({
    elevation: { value: 1.0, min: 0.5, max: 5, step: 0.15 },
    step: { value: 10, min: 1, max: 10, step: 1 },
  });
  const time = useRef({ value: 0 });
  useFrame(state => {
    time.current.value = state.clock.elapsedTime;
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight castShadow intensity={0.5} color="#0ff" position={[5, 5, -5]} />
      <mesh position={[0, 0, 0]} rotation={[-0.5 * Math.PI, 0, 0]} scale={[scale, scale, scale]}>
        <planeBufferGeometry args={[1, 1, planeDivisions, planeDivisions]} />
        <shaderMaterial
          key={Math.random()}
          transparent
          side={THREE.DoubleSide}
          //   blending={THREE.AdditiveBlending}
          uniforms={{
            uElevation: { value: elevation },
            uStep: { value: step },
            uTexture: { value: texture },
            uTime: time.current,
          }}
          vertexShader={`
            ${perlin2d}
            ${terrainVertex}
          `}
          fragmentShader={`
            ${perlin2d}
            ${terrainFragment}
          `}
        />
      </mesh>
    </>
  );
}

function Effects() {
  const { focusDistance, focalLength, bokehScale } = useControls('Blur', {
    focusDistance: { value: 0, min: 0, max: 0.1, step: 0.0001 },
    focalLength: { value: 0.03, min: 0, max: 0.1, step: 0.0001 },
    bokehScale: { value: 1, min: 0.01, max: 10, step: 0.01 },
  });
  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={focusDistance}
        focalLength={focalLength}
        bokehScale={bokehScale}
      />
    </EffectComposer>
  );
}
