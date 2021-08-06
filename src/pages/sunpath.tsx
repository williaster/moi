import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { extend, Canvas, useFrame, useThree, useResource } from 'react-three-fiber';
import { OrbitControls, Reflector } from '@react-three/drei';

import Page from '../components/Page';

// const material = new THREE.MeshPhysicalMaterial({
//   color: new THREE.Color('#bb86a1').convertSRGBToLinear(),
//   roughness: 0,
//   clearcoat: 1,
//   clearcoatRoughness: 0,
// })

const PhysicalMaterial = () => (
  <meshPhysicalMaterial color="#fff" clearcoat={1} clearcoatRoughness={0} roughness={0} />
);

const Scene = () => {
  const mesh1 = useRef();
  const mesh2 = useRef();
  const mesh3 = useRef();
  const lightRef1 = useResource();

  useFrame(() => {
    mesh1.current.rotation.z += 0.005;
    mesh2.current.rotation.y += 0.025;
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight intensity={0.8} position={[10, 10, -10]} />
      <spotLight
        // ref={lightRef1}
        angle={0.8}
        position={[-60, 0, 60]}
        lookAt={[0, 0, 0]}
        castShadow
        intensity={0.9}
      />
      {lightRef1.current && <spotLightHelper args={[lightRef1.current]} />}

      {/* <mesh position={[0, 0, -8]} rotation={[0, 0, 0]} receiveShadow>
        <planeBufferGeometry args={[100, 100, 1, 1]} />
        <meshPhongMaterial color="#ad93dd" reflectivity={0.2} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, 0, -7]} receiveShadow>
        <planeBufferGeometry args={[100, 100, 1, 1]} />
        <shadowMaterial color="#ad93dd" />
      </mesh> */}

      <Reflector
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
      </Reflector>

      <mesh ref={mesh1} position={[0, 0, 0]} castShadow>
        {/* <gridHelper /> */}
        <sphereBufferGeometry args={[5, 40, 30]} />
        <PhysicalMaterial />

        <mesh ref={mesh2} position={[5, 10, 0]} castShadow receiveShadow>
          <sphereBufferGeometry
            // radius={5}
            // widthSegments={8}
            // heightSegments={6}
            args={[3, 40, 30]}
            // phiLength={6.3}
            // thetaLength={3.1}
          />
          <PhysicalMaterial />
          {/* <gridHelper /> */}

          <mesh ref={mesh3} position={[3, 3, 0]} castShadow receiveShadow>
            <sphereBufferGeometry
              // radius={5}
              // widthSegments={8}
              // heightSegments={6}
              args={[1, 40, 30]}
              // phiLength={6.3}
              // thetaLength={3.1}
            />
            <PhysicalMaterial />
            {/* <axesHelper /> */}
            {/* <gridHelper /> */}
          </mesh>
        </mesh>
      </mesh>
    </>
  );
};

const HomePage = () => {
  return (
    <>
      <Page centerContent={false} showNav={false} padding={false}>
        <div className="canvas">
          <Canvas
            camera={{ position: [0, 0, 50], fov: 60 }}
            onCreated={canvas => canvas.gl.setClearColor('#ad93dd')}
            shadowMap
          >
            <Scene />
            <OrbitControls listenToKeyEvents={false} />
          </Canvas>
        </div>
      </Page>

      <style global jsx>{`
        .main {
          overflow: hidden;
          justify-content: flex-start;
          background: #ffb6c1;
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
};

export default HomePage;
