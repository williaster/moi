import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls, buttonGroup } from 'leva';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import CanvasPage from './CanvasPage';
import getStaticUrl from '../../utils/getStaticUrl';
import FlightHelmet from './models/FlightHelmet';
import Belo from './models/Belo';

const controlValues = {
  intensity: {
    value: 1,
    min: 0,
    max: 10,
    step: 0.1,
  },
  lightX: {
    min: -5,
    max: 5,
    step: 0.1,
    value: 0.25,
  },
  lightY: {
    min: -5,
    max: 5,
    step: 0.1,
    value: 3,
  },
  lightZ: {
    min: -5,
    max: 5,
    step: 0.1,
    value: -2.25,
  },
  modelRotationY: {
    value: 0,
    min: -Math.PI,
    max: Math.PI,
    step: 0.1,
  },
  envIntensity: {
    min: 0,
    max: 10,
    step: 0.1,
    value: 3.5,
  },
  toneExposure: {
    min: 0,
    max: 10,
    step: 0.1,
    value: 2,
  },
  // could do with button group but #s fine
  tone: {
    min: 0,
    max: 4,
    step: 1,
    value: THREE.CineonToneMapping,
  },
  // ' ': buttonGroup({
  //   none: () => set({ tone: THREE.NoToneMapping }),
  //   linear: () => set({ tone: THREE.LinearToneMapping }),
  //   reinhard: () => set({ tone: THREE.ReinhardToneMapping }),
  //   cineon: () => set({ tone: THREE.CineonToneMapping }),
  //   aces: () => set({ tone: THREE.ACESFilmicToneMapping }),
  // }),
};

export default function Models() {
  return (
    <CanvasPage background="#111">
      <Canvas
        shadowMap={{ type: THREE.PCFSoftShadowMap }}
        // gl={{ antialias: true }} // try setting false
        camera={{ fov: 40, position: [0, 0, -50] }}
        onCreated={canvasContext => {
          // make intensity meaningful
          canvasContext.gl.physicallyCorrectLights = true;
          // default is LinearEncoding
          canvasContext.gl.outputEncoding = THREE.sRGBEncoding;
        }}
      >
        <React.Suspense fallback={null}>
          <Scene />
          <OrbitControls listenToKeyEvents={false} />
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}

function Environment({ intensity }: { intensity: number }) {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    const path = getStaticUrl('/static/textures/environmentMaps/1/');
    const texture = loader.load(
      ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'].map(file => `${path}${file}`),
    );
    // note: GLTFEncoder sets sRGBEncoding on all loaded textures
    texture.encoding = THREE.sRGBEncoding;
    scene.background = texture;
    scene.environment = texture;
  }, []);

  useEffect(() => {
    // must set intenisty per node
    scene.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMapIntensity = intensity;

        // this could be more optimally set on the JSX?
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [intensity]);

  return null;
}

// updates tone mapping of the renderer
// this is the algo used to map HDR values (i.e., >1) to LDR values
function useToneMapping(mapping: number, exposure: number) {
  const { gl, scene } = useThree();
  useEffect(() => {
    gl.toneMapping = mapping;
    gl.toneMappingExposure = exposure;
    scene.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.needsUpdate = true;
      }
    });
  }, [mapping, exposure]);
}

function Scene() {
  const dirLightRef = useRef<THREE.DirectionalLight>();

  const {
    intensity,
    lightX,
    lightY,
    lightZ,
    modelRotationY,
    envIntensity,
    tone,
    toneExposure,
  } = useControls(controlValues);

  useToneMapping(tone, toneExposure);

  return (
    <>
      <directionalLight
        ref={dirLightRef}
        castShadow
        intensity={intensity}
        color="#fff"
        position={[lightX, lightY, lightZ]}
        lookAt={() => 0}
        shadow-camera-far={15}
        shadow-mapSize={[1024, 1024]}
      />
      {dirLightRef.current && <cameraHelper args={[dirLightRef.current.shadow.camera]} />}

      <FlightHelmet scale={[10, 10, 10]} position={[0, -4, 0]} rotation={[0, modelRotationY, 0]} />
      <Belo position={[4, -4, 0]} scale={[10, 10, 10]} />

      {/** note: this doesn't currently update on first render because models are still loading. */}
      <Environment intensity={envIntensity} />
    </>
  );
}
