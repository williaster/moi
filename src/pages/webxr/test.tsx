import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ARCanvas, Interactive } from '@react-three/xr';
import { OrbitControls, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import CanvasPage from '../../components/threejs/CanvasPage';
import Arrow from '../../components/threejs/models/Arrow';
import SunModel from '../../components/threejs/SunPath/SunModel';

export default function TestPage() {
  // const [latlng, setLatlng] = useState<{ lat: number; lng: number } | null | 'error'>(null);
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     pos => {
  //       setLatlng(() => ({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
  //     },
  //     () => console.warn('Could not get location'),
  //   );
  // }, []);
  // console.log(latlng);
  return (
    <CanvasPage background="transparent">
      <ARCanvas>
        <React.Suspense fallback={null}>
          <Scene />
          <OrbitControls />
        </React.Suspense>
      </ARCanvas>
    </CanvasPage>
  );
}

function useLatLng() {
  const [latlng, setLatlng] = useState<{ lat: number; lng: number } | null | 'error'>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatlng(() => ({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
      },
      () => {
        console.warn('Could not get location');
        setLatlng('error');
      },
    );
  }, []);

  return latlng;
}

/**
 * TODO
 * - get user lat lng
 * - get N direction from user
 * - get plane for orientation (mesh?)
 */

const cameraDirection = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();
const cameraQuaternion = new THREE.Quaternion();

function Scene() {
  const [north, setNorth] = useState<THREE.Vector3 | null>(
    typeof window !== 'undefined' && window.location.hash === '#local'
      ? new THREE.Vector3(0, 0, 0)
      : null,
  );
  const latlng = useLatLng();
  return (
    <>
      <axesHelper />
      <NorthControl north={north} setNorth={setNorth} />
      {north && latlng != null && latlng !== 'error' && <SunModel north={north} latlng={latlng} />}

      {/** @TODO add summary / controls */}
      {/** @TODO handle error state */}
    </>
  );
}
const textPosition = [0, 0, 0.035] as [number, number, number];

function NorthControl({
  distanceFromCamera = 2,
  color = '#783dff',
  height = -0.3,
  labelOffset = 0.5,
  north,
  setNorth,
}: {
  distanceFromCamera?: number;
  color?: string;
  height?: number;
  labelOffset?: number;
  north: THREE.Vector3 | null;
  setNorth: (set: (n: THREE.Vector3 | null) => null | THREE.Vector3) => void;
}) {
  const vec3 = useRef(new THREE.Vector3()).current;
  const arrowRef = useRef<THREE.Group>();

  const [isHovered, setIsHovered] = useState(false);

  const handleHover = useCallback(() => setIsHovered(h => !h), [setIsHovered]);
  const handleSelect = useCallback(() => {
    setNorth(n => (n ? null : vec3.clone()));
    setIsHovered(false);
  }, [setIsHovered]);

  useFrame(({ camera }) => {
    const arrow = arrowRef.current;
    if (!north) {
      camera.getWorldDirection(vec3);

      vec3.multiplyScalar(distanceFromCamera);
      vec3.add(camera.position);

      // y is constant
      arrow.position.set(vec3.x, height, vec3.z);
      // only update y-axis
      arrow.setRotationFromQuaternion(camera.quaternion);
      arrow.rotateX(0);
      arrow.rotateZ(0);
    }
  });
  return (
    <Interactive onHover={handleHover} onSelect={handleSelect}>
      <group ref={arrowRef} position={north ? [north.x, height, north.z] : undefined}>
        <group position={[0, 0.25, 0]}>
          <Arrow rotation={[Math.PI * 1, 0, Math.PI * 0.5]} color={'#8000e9'} />
          {north && (
            <Text fontSize={0.1} color={'#160029'} fillOpacity={1} position={textPosition}>
              N
            </Text>
          )}
        </group>
        {!north && (
          <group position={[0, labelOffset, 0]}>
            <mesh>
              <boxBufferGeometry args={[1, 0.15, 0.03]} />
              <meshBasicMaterial color={'#8000e9'} />
            </mesh>
            <Text fontSize={0.1} color={'#0e011a'} position={textPosition}>
              Tap to set North
            </Text>
          </group>
        )}
      </group>
    </Interactive>
  );
}
