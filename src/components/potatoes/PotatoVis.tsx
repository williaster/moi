import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { scaleLinear } from '@visx/scale';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
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
  geometry?: THREE.BufferGeometry;
  // [0, 1] whether to render 3d sampled geometry or 2d vis circles
  morphRef: React.MutableRefObject<{
    value: number;
  }>;
};

const ringVertexShader = `
  uniform float morph;
  uniform mat4 rotationMatrix;
  
  attribute vec3 startPosition;

  void main () {
    vec4 rotatedStartPosition = rotationMatrix * vec4(startPosition, 1.0);
    vec3 morphedPosition = mix(rotatedStartPosition.xyz, position, morph);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
  }
`;

const ringFragmentShader = `
  uniform float morph;
  uniform vec3 color;

  void main() {
    if (morph < 0.01) discard;
    gl_FragColor = vec4(color, morph + 0.5);
  }
`;

// note the number of sampled segments from the geometry is based
// on the # of ring segments
const thetaSegments = 50; // # around ring
const phiSegments = 5;

export const Vis = forwardRef(
  ({ fill, stroke, datum, gap = 1, geometry, morphRef }: VisProps, ref) => {
    const v = volume(datum);
    const a = area(datum);
    const volumeRadius = volumeScale(v);
    const areaRadius = Math.sqrt((a + Math.PI * volumeRadius * volumeRadius) / Math.PI);

    // morph uniform, exposed as a ref
    const morph = useRef({ value: 0 });
    useEffect(() => {
      if (morphRef) morphRef.current = morph.current;
    }, [morphRef]);

    // below we create inner and outer rings with extra startPosition attribute
    // based on sampled faces of the passed geometry
    // this enables morphing between the geometry and rings
    const { innerRingGeometry, outerRingGeometry } = useMemo(() => {
      if (!geometry) return {};

      // create a geometry copy so we can make it non-indexed
      let geoCopy = new THREE.BufferGeometry();
      geoCopy.copy(geometry);
      geoCopy = geoCopy.toNonIndexed().scale(12, 12, 12);

      // initialize rings
      const innerRingGeometry = new THREE.RingBufferGeometry(
        0,
        volumeRadius,
        thetaSegments,
        phiSegments,
      ).toNonIndexed(); // must be non-indexed to map faces

      const outerRingGeometry = new THREE.RingBufferGeometry(
        volumeRadius + gap,
        areaRadius,
        thetaSegments,
        phiSegments,
      ).toNonIndexed(); // must be non-indexed to map faces

      const coordsPerVertex = 3;
      const verticesPerFace = 3;
      const coordsPerFace = coordsPerVertex * verticesPerFace;
      const innerRingVertexCount = innerRingGeometry.attributes.position.count;
      const outerRingVertexCount = outerRingGeometry.attributes.position.count;

      const geometryVertexCount = geoCopy.attributes.position.count;
      const innerStartPositionArray = new Float32Array(innerRingVertexCount * verticesPerFace);
      const outerStartPositionArray = new Float32Array(outerRingVertexCount * verticesPerFace);

      // for each inner ring face, sample a random face on the geometry
      for (
        let faceIdx = 0;
        faceIdx < innerRingVertexCount * verticesPerFace;
        faceIdx += coordsPerFace
      ) {
        const randomGeomIdx = Math.floor(Math.random() * geometryVertexCount * verticesPerFace);
        const faceStartIdx = randomGeomIdx - (randomGeomIdx % coordsPerFace);

        for (let coordIdx = 0; coordIdx < coordsPerFace; coordIdx += 1) {
          const geoPosition = geoCopy.attributes.position.array[faceStartIdx + coordIdx];
          innerStartPositionArray[faceIdx + coordIdx] = geoPosition;
        }
      }

      // same for outer ring
      for (
        let faceIdx = 0;
        faceIdx < outerRingVertexCount * verticesPerFace;
        faceIdx += coordsPerFace
      ) {
        const randomGeomIdx = Math.floor(Math.random() * geometryVertexCount * verticesPerFace);
        const faceStartIdx = randomGeomIdx - (randomGeomIdx % coordsPerFace);

        for (let coordIdx = 0; coordIdx < coordsPerFace; coordIdx += 1) {
          const geoPosition = geoCopy.attributes.position.array[faceStartIdx + coordIdx];
          outerStartPositionArray[faceIdx + coordIdx] = geoPosition;
        }
      }

      innerRingGeometry.setAttribute(
        'startPosition',
        new THREE.BufferAttribute(innerStartPositionArray, coordsPerVertex),
      );

      outerRingGeometry.setAttribute(
        'startPosition',
        new THREE.BufferAttribute(outerStartPositionArray, coordsPerVertex),
      );

      geoCopy.dispose(); // ditch it

      return { innerRingGeometry, outerRingGeometry };
    }, [geometry, datum]);

    const strokeColor = useMemo(() => ({ value: new THREE.Color(stroke) }), [stroke]);
    const fillColor = useMemo(() => ({ value: new THREE.Color(fill) }), [fill]);

    const rotationMatrix = useRef({ value: new THREE.Matrix4() });
    useFrame(({ clock }) => {
      rotationMatrix.current.value.makeRotationY(Math.PI * clock.elapsedTime * 0.15);
    });

    return (
      <group ref={ref}>
        <mesh geometry={innerRingGeometry}>
          <shaderMaterial
            key={Math.random()} // @todo remove, how to handle disposal?
            transparent
            side={THREE.DoubleSide}
            uniforms={{
              morph: morph.current,
              rotationMatrix: rotationMatrix.current,
              color: fillColor,
            }}
            vertexShader={ringVertexShader}
            fragmentShader={ringFragmentShader}
          />
        </mesh>
        <mesh geometry={outerRingGeometry}>
          <shaderMaterial
            key={Math.random()} // @todo remove, how to handle disposal?
            transparent
            side={THREE.DoubleSide}
            uniforms={{
              morph: morph.current,
              rotationMatrix: rotationMatrix.current,
              color: strokeColor,
            }}
            vertexShader={ringVertexShader}
            fragmentShader={ringFragmentShader}
          />
        </mesh>
      </group>
    );
  },
);
