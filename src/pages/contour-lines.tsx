import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls, Reflector } from '@react-three/drei';

import Page from '../components/Page';
import { CountourLines } from '../components/ContourLines';

const background = '#0a0910';

function Scene() {
  const lightRef1 = useResource();
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight castShadow intensity={0.5} color="#fff" position={[0, 0, 100]} />

      {/* <pointLight intensity={0.8} position={[10, 10, -10]} /> */}
      {/* <spotLight
        ref={lightRef1}
        angle={0.2}
        position={[0, 0, 100]}
        lookAt={[0, 0, 0]}
        castShadow
        intensity={0.2}
      /> */}
      {/* {lightRef1.current && <spotLightHelper args={[lightRef1.current]} />} */}
      {/* <Reflector
        resolution={1024}
        // receiveShadow
        mirror={0}
        blur={[500, 100]}
        mixBlur={1}
        mixStrength={0.2}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={0.6}
        position={[0, 0, -5]}
        scale={[2, 2, 1]}
        rotation={[0, 0, 0]}
        args={[70, 70]}
      >
        {(Material, props) => (
          <Material
            metalness={0.15}
            color="#ad93dd"
            side={THREE.DoubleSide}
            roughness={0.15}
            {...props}
          />
        )}
      </Reflector> */}
      <mesh position={[70, 70, 10]} castShadow receiveShadow>
        <sphereBufferGeometry
          // radius={5}
          // widthSegments={8}
          // heightSegments={6}
          args={[5, 40, 30]}
          // phiLength={6.3}
          // thetaLength={3.1}
        />
        <meshPhysicalMaterial color="#222" clearcoat={1} clearcoatRoughness={0} roughness={0} />
      </mesh>

      <mesh position={[0, 0, -10]} rotation={[0, 0, 0]} receiveShadow>
        <planeBufferGeometry args={[500, 500, 1, 1]} />
        <meshPhongMaterial color="#c6fced" reflectivity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <CountourLines />
    </>
  );
}

function Contours() {
  return (
    <>
      <Page centerContent={false} showNav={false} padding={false}>
        <div className="canvas">
          <Canvas
            shadowMap
            camera={{ position: [0, 0, 80], fov: 100 }}
            // onCreated={canvas => canvas.gl.setClearColor(background)}
          >
            <Scene />
            <OrbitControls listenToKeyEvents={false} />
          </Canvas>
        </div>
      </Page>

      <style global jsx>{`
        .main {
          overflow: hidden;
          background: ${background};
          justify-content: flex-start;
          cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMCIgZmlsbD0id2hpdGUiLz48L3N2Zz4='),
            auto;
        }

        .canvas,
        canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default Contours;
