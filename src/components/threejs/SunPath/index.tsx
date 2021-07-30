import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Leva, useControls, folder } from 'leva';
import CanvasPage from '../CanvasPage';
import ThreeJs from '../../../pages/threejs';
import { ArrowHelper, MathUtils, PointLight, SphereGeometry, Vector3 } from 'three';
import SidePanel from './SidePanel';
import { getPosition, getTimes, getPositionDaysHours } from './solarCalculations-2';
import { polarToCartesian } from './getSunPosition';

export default function SunPath() {
  const { background, day, hour, latitude, longitude } = useControls({
    background: '#10232e',
    day: { value: 0, min: 1, max: 365, step: 1 },
    hour: { value: 11, min: -5, max: 24, step: 1 },
    latitude: { value: 37.775, min: -90, max: 90, step: 0.001 },
    longitude: { value: -122.419, min: -180, max: 180, step: 0.001 },
  });
  return (
    <CanvasPage>
      <Leva titleBar={false} />
      <Canvas camera={{ position: [0, 10, 20] }}>
        <React.Suspense fallback={null}>
          <color attach="background" args={[background]} />
          <group rotation={[0, 0, Math.PI]}>
            <Scene latitude={latitude} longitude={longitude} day={day} hour={hour} />
          </group>
          <OrbitControls listenToKeyEvents={false} />
        </React.Suspense>
      </Canvas>
      <SidePanel latitude={latitude} longitude={longitude} />
    </CanvasPage>
  );
}

const horizonSize = 50;
const horizonSegments = 2;
const atmosphereRadius = horizonSize * 0.4 * 0.5;

const now = new Date();
const origin = new THREE.Vector3(0, 0, 0);
const direction = new THREE.Vector3(1, 1, 1).normalize();

function Scene({
  latitude,
  longitude,
  day,
  hour,
}: {
  latitude: number;
  longitude: number;
  day: number;
  hour: number;
}) {
  const arrowRef = useRef<ArrowHelper>();
  const { plane: planeColor } = useControls({
    // thetaStart: { value: 0, min: 0, max: 2 * Math.PI, step: 0.1 },
    // thetaLength: { value: Math.PI, min: 0, max: Math.PI, step: 0.1 },
    // rotateZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    plane: '#2a2a2a',
  });
  useEffect(() => {
    const date = new Date(+now + day * 24 * 60 * 60 * 1000);
    const polar = getPositionDaysHours(date, hour, latitude, longitude);
    direction.setFromSphericalCoords(
      atmosphereRadius,
      Math.PI * 0.5 - polar.altitude,
      polar.azimuth,
    );
    arrowRef.current.setDirection(direction.normalize());
  }, [latitude, longitude, day, hour]);

  return (
    <>
      <ambientLight intensity={1} />

      {/** Plane of reference */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[horizonSize, horizonSize, horizonSegments, horizonSegments]} />
        <meshStandardMaterial transparent opacity={0.9} side={THREE.FrontSide} color={planeColor} />
      </mesh>

      <Sun latitude={latitude} longitude={longitude} day={day} hour={hour} />
      <Arc latitude={latitude} longitude={longitude} day={day} />
      <Analemma latitude={latitude} longitude={longitude} hour={hour} />

      {/** compass */}
      <Compass />

      {/** Vector toward sun */}
      <arrowHelper ref={arrowRef} args={[direction, origin, atmosphereRadius, '#222', 1.25, 1]} />

      {/* <mesh position={[0, 0, 0]} rotation={[Math.PI * 0.5, 0, rotateZ]}>
        <sphereGeometry
          args={[atmosphereRadius, 30, 15, 0, Math.PI * 2, thetaStart, thetaLength]}
        />
        <shaderMaterial
          key={Math.random()}
          wireframe
          transparent
          //   colorWrite={false}
          //   depthWrite={false}
          side={THREE.DoubleSide}
          vertexShader={`
            varying vec4 modelPosition;

            void main() {
                modelPosition = modelMatrix * vec4(position, 1.0);
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                gl_Position = projectedPosition;
            }
        `}
          fragmentShader={`
            varying vec4 modelPosition;
            void main() {
                if (modelPosition.z < 0.0) {
                    discard;
                }
                
                gl_FragColor = vec4(0.0, 0.5, 0.5, 0.5);
            }
          `}
        />
      </mesh> */}
    </>
  );
}

function Arc({ latitude, longitude, day }) {
  const ref = useRef();
  const points = useMemo(() => {
    return new Array(100).fill(null).map((_, quarterHour) => {
      const date = new Date(+now + day * 24 * 60 * 60 * 1000);
      const polar = getPositionDaysHours(date, quarterHour * 0.25, latitude, longitude);
      return new Vector3().setFromSphericalCoords(
        atmosphereRadius,
        Math.PI * 0.5 - polar.altitude,
        polar.azimuth,
      );
    });
  }, [latitude, longitude, day]);
  const onUpdate = useCallback(self => self.setFromPoints(points), [points]);

  return (
    <>
      <line ref={ref}>
        <bufferGeometry attach="geometry" onUpdate={onUpdate} />
        <lineBasicMaterial color="#ffdb49" />
      </line>
    </>
  );
}

function Analemma({ latitude, longitude, hour = 15 }) {
  const ref = useRef();
  const points = useMemo(() => {
    return new Array(365).fill(null).map((_, day) => {
      const date = new Date(+now + (day + 1) * 24 * 60 * 60 * 1000);
      const polar = getPositionDaysHours(date, hour, latitude, longitude);
      return new Vector3().setFromSphericalCoords(
        atmosphereRadius,
        Math.PI * 0.5 - polar.altitude,
        polar.azimuth,
      );
    });
  }, [latitude, longitude, hour]);
  const onUpdate = useCallback(self => self.setFromPoints(points), [points]);

  return (
    <>
      <line ref={ref}>
        <bufferGeometry attach="geometry" onUpdate={onUpdate} />
        <lineBasicMaterial color="#5249ff" />
      </line>
    </>
  );
}

function Sun({ latitude, longitude, day, hour }) {
  const pointLightRef = useRef<PointLight>();
  const sunPosition = useMemo(() => {
    const date = new Date(+now + day * 24 * 60 * 60 * 1000);
    const polar = getPositionDaysHours(date, hour, latitude, longitude);
    const pos = new Vector3().setFromSphericalCoords(
      atmosphereRadius,
      Math.PI * 0.5 - polar.altitude,
      polar.azimuth,
    );
    pointLightRef.current?.position.set(pos.x, pos.y, pos.z);
    return pos;
  }, [latitude, longitude, day, hour]);

  return (
    <>
      <pointLight ref={pointLightRef} color="#ffff26" intensity={10} />
      <mesh position={sunPosition}>
        <sphereBufferGeometry args={[0.3, 10, 10]} />
        <meshBasicMaterial color="#ffffa4" />
      </mesh>
    </>
  );
}

const compassSize = horizonSize * 0.5;
const z = 0.5; // above plane
const compassPoints = [
  // NS along y-axis
  new THREE.Vector3(0, -compassSize / 2, z),
  // back to zero
  new THREE.Vector3(0, 0, z),
];

function Compass() {
  const ref = useRef();
  const onUpdate = useCallback(self => self.setFromPoints(compassPoints), []);
  return (
    <>
      <line ref={ref}>
        <bufferGeometry attach="geometry" onUpdate={onUpdate} />
        <lineBasicMaterial color="#1e1f1f" />
      </line>
      <Text
        fontSize={2}
        color="#1e1f1f"
        position={compassPoints[0]}
        rotation={[0, 0, Math.PI]}
        anchorY="bottom"
      >
        N
      </Text>
    </>
  );
}
