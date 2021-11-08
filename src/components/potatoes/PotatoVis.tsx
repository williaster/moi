import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { scaleLinear } from '@visx/scale';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import potatoData from './potatoData';

const dataArray = Object.values(potatoData);

type Datum = { area: number; volume: number; ratio: number };

// area should scale as the sqrt
const volume = (d: Datum) => Math.sqrt(d.volume);
const area = (d: Datum) => Math.sqrt(d.area);

const volumeScale = scaleLinear({
  domain: [Math.min(...dataArray.map(volume)), Math.max(...dataArray.map(volume))],
  range: [1, 50],
});

type VisProps = {
  fill: string;
  stroke: string;
  datum: Datum;
  gap?: number;
  segments?: number;
  geometry?: THREE.BufferGeometry;
};
type SomeVisProps = Pick<VisProps, 'stroke' | 'fill'>;

export const Vis = forwardRef(
  ({ fill, stroke, datum, gap = 1, segments = 50, geometry }: VisProps, ref) => {
    const v = volume(datum);
    const a = area(datum);
    const volumeRadius = 0.2 * volumeScale(v);
    const areaRadius = 0.2 * Math.sqrt((a + Math.PI * volumeRadius * volumeRadius) / Math.PI);

    const geo = useMemo(() => {
      if (!geometry) return null;

      let geoCopy = new THREE.BufferGeometry();
      geoCopy.copy(geometry);
      geoCopy = geoCopy.toNonIndexed();

      const ringGeo = new THREE.RingBufferGeometry(
        volumeRadius + gap,
        areaRadius,
        segments,
        15,
      ).toNonIndexed();

      const positionItemSize = 3;
      const faceSize = 3 * positionItemSize;
      const ringVertexCount = ringGeo.attributes.position.count;
      const ringFaceCount = ringVertexCount / 3;
      const geometryVertexCount = geoCopy.attributes.position.count;
      const startArray = new Float32Array(ringVertexCount * positionItemSize);

      // // console.log({ ringVertexCount, geometryVertexCount });
      for (let faceIdx = 0; faceIdx < ringVertexCount * 3; faceIdx += faceSize) {
        // find a random index on the geometry
        const randomGeomIdx = Math.floor(Math.random() * geometryVertexCount * 3);
        const faceStartIdx = randomGeomIdx - (randomGeomIdx % faceSize);

        for (let vertexIdx = 0; vertexIdx < faceSize; vertexIdx += 1) {
          const geoPosition = geoCopy.attributes.position.array[faceStartIdx + vertexIdx];
          startArray[faceIdx + vertexIdx] = geoPosition;
        }
      }

      ringGeo.setAttribute(
        'startPosition',
        new THREE.BufferAttribute(startArray, positionItemSize),
      );
      // console.log(ringGeo.attributes.position, ringGeo.attributes.startPosition);

      return ringGeo;
    }, [geometry, datum]);

    const morph = useRef({ value: 0 });
    const morphDelta = useRef(0.0075);
    const pauseCount = useRef(0);
    useFrame(() => {
      const nextValue = Math.max(0, Math.min(morph.current.value + morphDelta.current, 1));
      morph.current.value = nextValue;
      if ((nextValue >= 1 || nextValue <= 0) && pauseCount.current >= 200) {
        morphDelta.current *= -1;
        pauseCount.current = 0;
      } else {
        pauseCount.current += 1;
      }
    });

    return (
      <group ref={ref}>
        {geo ? (
          <mesh geometry={geo}>
            {/* <meshBasicMaterial color="purple" /> */}
            <shaderMaterial
              key={Math.random()} // @todo remove, how to handle disposal?
              transparent
              side={THREE.DoubleSide}
              uniforms={{
                morph: morph.current,
              }}
              vertexShader={`
                uniform float morph;

                attribute vec3 startPosition;
              
                void main () {
                  vec3 morphedPosition = mix(startPosition, position, morph);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
                }
              `}
              fragmentShader={`
                void main() {
                  gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
                }
              `}
            />
          </mesh>
        ) : (
          <>
            <mesh>
              <ringBufferGeometry args={[0, volumeRadius, segments, Math.floor(segments * 0.1)]} />
              <meshBasicMaterial color={fill} />
            </mesh>
            <mesh position-z={0.2}>
              <ringBufferGeometry args={[volumeRadius + gap, areaRadius, segments, 1]} />
              <meshBasicMaterial color={stroke} />
            </mesh>
          </>
        )}
      </group>
    );
  },
);

export const PotatoVis = forwardRef((props: SomeVisProps, ref) => (
  <Vis {...props} ref={ref} datum={potatoData.potato} />
));
export const WedgeVis = forwardRef((props: SomeVisProps, ref) => (
  <Vis {...props} ref={ref} datum={potatoData.wedge} />
));
export const TotVis = forwardRef((props: SomeVisProps, ref) => (
  <Vis {...props} ref={ref} datum={potatoData.tot} />
));
export const FryVis = forwardRef((props: SomeVisProps, ref) => (
  <Vis {...props} ref={ref} datum={potatoData.fry} />
));
export const CurlyVis = forwardRef((props: SomeVisProps, ref) => (
  <Vis {...props} ref={ref} datum={potatoData.curly} />
));
export const WaffleVis = forwardRef((props: SomeVisProps, ref) => (
  <Vis {...props} ref={ref} datum={potatoData.waffle} />
));
export const RidgedVis = forwardRef((props: SomeVisProps, ref) => (
  <Vis {...props} ref={ref} datum={potatoData.ridged} />
));
