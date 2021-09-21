import React, { useMemo, useRef } from 'react';
import { useFrame, extend } from 'react-three-fiber';
import * as THREE from 'three';
import * as meshline from 'threejs-meshline';
import SimplexNoise from 'simplex-noise';
import { contours as d3Contours } from 'd3-contour';
import { range, pairs } from 'd3-array';
import { interpolateGreys as colorScale } from 'd3-scale-chromatic';
import noise from '../utils/noise';
import geoJsonToGeometry from '../utils/geoJsonToGeometry';

extend(meshline);

const simplexNoise = new SimplexNoise();

function reflectVertices(values: number[]) {
  const reflectedVertices = new Array(values.length);
  const segments = Math.sqrt(values.length);

  let originalIndex = 0;
  for (let x = 0; x < segments; x += 1) {
    for (let y = 0; y < segments; y += 1) {
      const value = values[originalIndex];
      const newIndex = x * segments + y;
      reflectedVertices[newIndex] = value;

      originalIndex += 1;
    }
  }

  return reflectedVertices;
}

function generateLines({ segments = 200, zScalar = 30, noiseScalar = 0.03, noise = 0.5 }) {
  const plane = new THREE.PlaneGeometry(segments, segments, segments, segments);
  plane.verticesNeedUpdate = true;

  for (let i = 0; i < plane.vertices.length; i += 1) {
    const vertex = plane.vertices[i];
    vertex.z =
      simplexNoise.noise3D(vertex.x * noiseScalar, vertex.y * noiseScalar, vertex.z * noiseScalar) *
      zScalar;
    vertex.z +=
      simplexNoise.noise3D(
        vertex.x * noiseScalar * noise,
        vertex.y * noiseScalar * noise,
        vertex.z * noiseScalar * noise,
      ) *
      zScalar *
      noise;
  }

  const contours = d3Contours()
    .size([segments, segments])
    .thresholds(range(-zScalar, zScalar, zScalar / 10))(
    // reflectVertices(plane.vertices.map(v => v.z)),
    plane.vertices.map(v => v.z),
  );

  const contourLines = contours.map(contour => {
    const geometry = new THREE.Geometry();

    contour.coordinates.forEach((line, lineIndex) => {
      pairs(
        line[0].map(point => new THREE.Vector3(point[0], point[1], contour.value)),
        (a, b) => {
          geometry.vertices.push(a, b);
        },
      );
    });
    return geometry;
  });

  console.log({ plane, contours, contourLines });

  return { contourLines, plane };
}

// const colors = ['#e36bae', '#d89cf6', '#ffba93', '#ff8e71', '#c6fced'];
const colors = ['#005a8d', '#b8b5ff', '#ff96ad', '#fff5fd'];

export default function CountourLines() {
  const zScalar = 30;
  const noiseScalar = 0.01;
  const segments = 100;
  const { contourLines, plane } = useMemo(
    () => generateLines({ segments, zScalar, noiseScalar }),
    [],
  );
  const idx = 50;
  return (
    <>
      <mesh
        receiveShadow
        position={[segments / 2, segments / 2, 0]}
        // rotation={[Math.PI, Math.PI, 0]}
        scale={[1, 1, 1]}
      >
        <geometry
          key={Math.random()}
          attach="geometry"
          vertices={plane.vertices}
          faces={plane.faces}
        />
        <meshPhongMaterial
          wireframe={false}
          color={'#b8b5ff'}
          reflectivity={0.2}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>
      {/* {contourLines.map((geometry, i) => (
        <Line
          key={i}
          color={
            // colorScale(geometry.vertices?.[0].z / zScalar)
            // colors[Math.floor(colors.length * Math.random())]
            '#fff'
          }
          geometry={geometry}
        />
      ))} */}
      {plane.vertices.map((v, i) =>
        i % 10 ? null : (
          <mesh
            key={i}
            position={[v.x + segments / 2, v.y + segments / 2, v.z + 5]}
            //   rotate={[Math.PI, Math.PI, 0]}
          >
            <boxGeometry args={[1, 1, 5]} />
            <meshPhongMaterial color={colors[i % colors.length]} />
          </mesh>
        ),
      )}
    </>
  );
}

function Line({ geometry, width = 0.5, color, speed = 0.0002, animate = false }) {
  const material = useRef<any>();
  useFrame(() => {
    if (animate && material.current) {
      material.current.uniforms.dashOffset.value -= speed;
    }
  });
  return (
    // <mesh
    // // castShadow raycast={meshline.MeshLineRaycast}
    // >
    //   {/** @ts-expect-error meshline not a jsx element */}
    //   <meshLine attach="geometry" vertices={vertices} />
    //   {/** @ts-expect-error */}
    //   <meshLineMaterial
    //     // castShadow
    //     attach="material"
    //     ref={material}
    //     transparent
    //     depthTest={false}
    //     lineWidth={width}
    //     color={color}
    //     dashArray={animate ? 0.6 : undefined}
    //     dashRatio={animate ? 0.1 : undefined}
    //   />

    //   {/* <meshPhysicalMaterial color={color} clearcoat={1} clearcoatRoughness={0} roughness={0} /> */}
    // </mesh>
    <mesh position={[0, 0, 0]}>
      <primitive
        object={
          new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color, linewidth: 5 }))
        }
      />
    </mesh>
  );
}
