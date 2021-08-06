import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Leva, useControls, folder } from 'leva';
import * as meshline from 'threejs-meshline';

import CanvasPage from '../CanvasPage';
import ThreeJs from '../../../pages/threejs';
import { ArrowHelper, MathUtils, PointLight, SphereGeometry, Vector3 } from 'three';
import SidePanel from './SidePanel';
import { getPosition, getTimes, getPositionDaysHours } from './solarCalculations-2';
import Effects from './Effects';

extend(meshline);

const getVec3FromPolar = (polar: ReturnType<typeof getPositionDaysHours>, radius: number) => {
  const vec3 = new Vector3().setFromSphericalCoords(
    radius,
    Math.PI * 0.5 - polar.altitude,
    polar.azimuth,
  );
  return vec3;
};

export default function SunPath() {
  const {
    background,
    day,
    hour,
    lat,
    lng,
    planeColor,
    dayColor,
    solsticeColor,
    analemmaColor,
  } = useControls({
    background: '#377780',
    planeColor: '#581286',
    dayColor: '#c6ffe5',
    solsticeColor: '#e3b7ff', // '#e0e887',
    analemmaColor: '#ffa7be',
    day: { value: 0, min: 1, max: 365, step: 1 },
    hour: { value: 11, min: 0, max: 24, step: 0.5 },
    lat: { value: 37.775, min: -90, max: 90, step: 0.001 },
    lng: { value: -122.419, min: -180, max: 180, step: 0.001 },
  });
  return (
    <CanvasPage>
      <Leva titleBar={false} />
      <Canvas>
        <React.Suspense fallback={null}>
          {/* <axesHelper /> */}
          <color attach="background" args={[background]} />
          <Scene
            lat={lat}
            lng={lng}
            day={day}
            hour={hour}
            planeColor={planeColor}
            dayColor={dayColor}
            solsticeColor={solsticeColor}
            analemmaColor={analemmaColor}
            backgroundColor={background}
          />
          <OrbitControls />
          {/* <Effects /> */}
        </React.Suspense>
      </Canvas>
      {/* <SidePanel lat={lat} lng={lng} /> */}
    </CanvasPage>
  );
}

const horizonSize = 200;
const horizonSegments = 2;
const atmosphereRadius = horizonSize * 0.2;

const msPerDay = 24 * 60 * 60 * 1000;
const msPerMinute = 60 * 1000;

// @TODO this is not correct timezone-wise
const zeroDate = new Date(
  new Date('2020-01-01').valueOf() - new Date('2020-01-01').getTimezoneOffset() * msPerMinute,
).valueOf();
const origin = new THREE.Vector3(0, 0, 0);
const direction = new THREE.Vector3(1, 1, 1).normalize();

function Scene({
  lat,
  lng,
  day,
  hour,
  planeColor,
  dayColor,
  solsticeColor,
  analemmaColor,
  backgroundColor,
}) {
  return (
    <>
      <ambientLight color="#05055e" intensity={1.5} />

      <group rotation={[Math.PI * 0.5, 0, 0]}>
        <mesh>
          <circleGeometry args={[atmosphereRadius, 50, 10]} />
          <meshStandardMaterial
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            color={planeColor}
            metalness={0.1}
            roughness={0.5}
          />
        </mesh>
      </group>

      <Sun lat={lat} lng={lng} day={day} hour={hour} />

      {/** arcs for current day/hour/lat/lng */}
      <Arc lat={lat} lng={lng} day={day} hour={hour} color={dayColor} />
      <WinterSolsticeArc lat={lat} lng={lng} color={solsticeColor} />
      <SummerSolsticeArc lat={lat} lng={lng} color={solsticeColor} />

      {/** position for all days at current hour/lat/lng */}
      <Analemma lat={lat} lng={lng} hour={hour} color={analemmaColor} />

      {/** Sun rays on floor */}
      <SunRays lat={lat} lng={lng} day={day} hour={hour} />

      {/** compass */}
      <Compass lat={lat} color={backgroundColor} />
    </>
  );
}

const invisible = new THREE.Color('yellow');

function SunRays({ lat, lng, day, hour }) {
  const { rayColor, raySpacing, rayLength } = useControls({
    rayColor: '#de6868',
    raySpacing: {
      value: 5,
      min: 1,
      max: 50,
      step: 1,
    },
    rayLength: {
      value: 3,
      min: 1,
      max: 15,
      step: 0.5,
    },
  });
  const meshRef = useRef<THREE.InstancedMesh>();
  const object3d = useMemo(() => new THREE.Object3D(), []);

  // direction for a single ray, which is instanced below
  const rayPolar = useMemo(() => {
    const date = new Date(zeroDate + day * 24 * 60 * 60 * 1000);
    return getPositionDaysHours(date, hour, lat, lng);
  }, [lat, lng, day, hour]);

  const rayPoint = useMemo(() => getVec3FromPolar(rayPolar, rayLength).normalize(), [
    rayPolar,
    rayLength,
  ]);

  // grid of rays
  const rayCountPerRow = Math.floor(horizonSize / raySpacing);
  const rayCount = rayCountPerRow ** 2;

  useEffect(() => {
    // translate each ray across the grid
    for (let i = 0; i < rayCount; i += 1) {
      const rayX = (Math.floor(i / rayCountPerRow) + 0.5) * raySpacing - horizonSize / 2;
      const rayY = ((i % rayCountPerRow) + 0.5) * raySpacing - horizonSize / 2;
      // translate z such that bottom is on plane
      const rayZ = rayLength * 0.3 * Math.sin(rayPolar.altitude);

      // raypoint is only correct from origin
      object3d.position.set(0, 0, 0);
      object3d.lookAt(rayPoint);
      // cylinder face that is looking at rayPoint is incorrect, so rotate it another 90deg
      object3d.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI * 0.5);

      object3d.position.set(rayX, rayZ, rayY);
      // object3d.position.set(rayX, rayY, 0);
      // object3d.translateOnAxis(new THREE.Vector3(0, 0, -1), rayZ);

      // hide rays outside circle
      const isHidden = Math.sqrt(rayX ** 2 + rayY ** 2) > atmosphereRadius;
      if (isHidden) {
        // how to just make transparent? .setColorAt doesn't seem to work
        object3d.position.set(10000, 10000, 10000);
      }

      object3d.updateMatrix();
      // And apply the matrix to the instanced item
      meshRef.current.setMatrixAt(i, object3d.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    // meshRef.current.instanceColor.needsUpdate = true;
  }, [rayCountPerRow, raySpacing, rayPoint.x, rayPoint.y, rayPoint.z]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, rayCount]}>
      <cylinderBufferGeometry args={[0.015, 0.3, rayLength, 10, 10]} />
      <meshStandardMaterial color={rayColor} metalness={0.1} roughness={1} />
    </instancedMesh>
  );
}

function WinterSolsticeArc({ lat, lng, color }) {
  // winter solstice is usually Dec 21/22
  const winterSolsticeDay = 365.25 - 9.5;
  return <Arc dashed lat={lat} lng={lng} day={winterSolsticeDay} color={color} />;
}

function SummerSolsticeArc({ lat, lng, color }) {
  // summer solstice is usually June 21/22
  const summerSolsticeDay = (171.25 + 172.25) / 2;
  return <Arc dashed lat={lat} lng={lng} day={summerSolsticeDay} color={color} />;
}

function Arc({ lat, lng, hour = null, day, color, dashed = false }) {
  const [solidPoints, dashedPoints] = useMemo(() => {
    const solidPts = [];
    const dashedPts = [];

    // point for each quarter hour
    new Array(24 * 4 + 1).fill(null).forEach((_, quarterHour) => {
      const date = new Date(zeroDate + day * 24 * 60 * 60 * 1000);
      const currHour = quarterHour * 0.25;
      const polar = getPositionDaysHours(date, currHour, lat, lng);
      const vec3 = getVec3FromPolar(polar, atmosphereRadius);

      // don't show below plane
      // note: doing this compresses the dash offset :(
      // if (vec3.z < -5) return;

      const pointIsSolid = !dashed; // && (hour == null || (lat > 0 ? currHour <= hour : currHour >= hour));

      if (pointIsSolid) {
        solidPts.push(vec3);
      } else {
        dashedPts.push(vec3);
      }
    });
    return [solidPts, dashedPts];
  }, [lat, lng, day, hour]);

  const dashedMaterial = useRef<any>();
  useFrame(() => {
    // only animate !dashed && hour case
    if (!dashed && hour != null && dashedMaterial.current) {
      const direction = lat > 0 ? -1 : 1;
      dashedMaterial.current.uniforms.dashOffset.value += direction * 0.0005;
    }
  });

  return (
    <>
      {solidPoints.length > 0 && (
        <mesh>
          {/** @ts-expect-error meshline not a jsx element */}
          <meshLine attach="geometry" vertices={solidPoints} />
          {/** @ts-expect-error */}
          <meshLineMaterial transparent attach="material" lineWidth={0.5} color={color} />
        </mesh>
      )}

      {dashedPoints.length > 0 && (
        <mesh>
          {/** @ts-expect-error meshline not a jsx element */}
          <meshLine attach="geometry" vertices={dashedPoints} />
          {/** @ts-expect-error */}
          <meshLineMaterial
            ref={dashedMaterial}
            transparent
            attach="material"
            // depthTest={false}
            lineWidth={0.3}
            color={color}
            dashArray={0.02}
            lineCap
          />
        </mesh>
      )}
    </>
  );
}

function Analemma({ lat, lng, hour = 15, color }) {
  const points = useMemo(() => {
    // +1 day to avoid gap
    return new Array(366).fill(null).map((_, day) => {
      const date = new Date(zeroDate + (day + 1) * 24 * 60 * 60 * 1000);
      const polar = getPositionDaysHours(date, hour, lat, lng);
      return getVec3FromPolar(polar, atmosphereRadius);
    });
  }, [lat, lng, hour]);

  return (
    <mesh>
      {/** @ts-expect-error meshline not a jsx element */}
      <meshLine attach="geometry" vertices={points} />
      {/** @ts-expect-error */}
      <meshLineMaterial
        transparent
        attach="material"
        // depthTest={false}
        lineWidth={0.2}
        color={color}
      />
    </mesh>
  );
}

function Sun({ lat, lng, day, hour, radius = 3 }) {
  const pointLightRef = useRef<PointLight>();
  const sunPosition = useMemo(() => {
    const date = new Date(zeroDate + day * 24 * 60 * 60 * 1000);
    const polar = getPositionDaysHours(date, hour, lat, lng);
    const pos = getVec3FromPolar(polar, atmosphereRadius);
    pointLightRef.current?.position.set(pos.x, pos.y, pos.z);
    return pos;
  }, [lat, lng, day, hour]);

  return (
    <>
      <pointLight ref={pointLightRef} color="#ffff26" intensity={10} />
      <mesh position={sunPosition}>
        <sphereBufferGeometry args={[radius, 40, 40]} />
        <meshPhongMaterial flatShading color="#a7a79c" emissive="#ffff00" shininess={100} />
      </mesh>
    </>
  );
}

const compassSize = atmosphereRadius * 2;
const compassFontSize = 5;
const compassFontColor = '#aeaeae';
const compassOffset = 0.1; // above plane

function Compass({ lat, color }) {
  const [ns, ew] = useMemo(
    () => [
      [
        // N goes -Z
        new THREE.Vector3(0, compassOffset, (lat > 0 ? -1 : 1) * compassSize * 0.5),

        // S goes +Z
        new THREE.Vector3(0, compassOffset, (lat < 0 ? -1 : 1) * compassSize * 0.5),
      ],

      [
        // E goes +X
        new THREE.Vector3((lat > 0 ? 1 : -1) * compassSize * 0.5, compassOffset, 0),

        // W goes -X
        new THREE.Vector3((lat < 0 ? 1 : -1) * compassSize * 0.5, compassOffset, 0),
      ],
    ],
    [lat],
  );
  return (
    <>
      <mesh>
        {/** @ts-expect-error meshline not a jsx element */}
        <meshLine attach="geometry" vertices={ns} />
        {/** @ts-expect-error */}
        <meshLineMaterial
          transparent
          attach="material"
          lineWidth={0.1}
          color={color}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        {/** @ts-expect-error meshline not a jsx element */}
        <meshLine attach="geometry" vertices={ew} />
        {/** @ts-expect-error */}
        <meshLineMaterial
          transparent
          attach="material"
          lineWidth={0.1}
          color={color}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text
        fontSize={compassFontSize}
        color={compassFontColor}
        position={ns[0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        anchorY={lat > 0 ? 'bottom' : 'top'}
      >
        N
      </Text>

      <Text
        fontSize={compassFontSize}
        color={compassFontColor}
        position={ns[1]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        anchorY={lat < 0 ? 'bottom' : 'top'}
      >
        S
      </Text>

      <Text
        fontSize={compassFontSize}
        color={compassFontColor}
        position={ew[0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        anchorX={lat > 0 ? 'left' : 'right'}
      >
        E
      </Text>

      <Text
        fontSize={compassFontSize}
        color={compassFontColor}
        position={ew[1]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        anchorX={lat < 0 ? 'left' : 'right'}
      >
        W
      </Text>
    </>
  );
}

function HideBelowZMaterial({ color }) {
  return (
    <shaderMaterial
      attach="material"
      side={THREE.DoubleSide}
      uniforms={{ uColor: { value: new THREE.Color(color) } }}
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
        uniform vec3 uColor;
        
        void main() {
          // if (modelPosition.z < 0.0) {
          //     discard;
          // }

          gl_FragColor = vec3(uColor, 1.0);
        }
      `}
    />
  );
}
