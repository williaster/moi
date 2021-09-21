import React, { useMemo, useRef } from 'react';
import { useFrame, extend } from 'react-three-fiber';
import * as THREE from 'three';
import * as meshline from 'threejs-meshline';
// import SimplexNoise from 'simplex-noise';
import { interpolateGreys as colorScale } from 'd3-scale-chromatic';
import noise from '../utils/noise';

extend(meshline);

const scaledNoise = noise(0.05);
const lineDivisions = 5000;
const positionsPerLine = 5000;
const getLineOrigin = (scalar = 30) =>
  new THREE.Vector3(scalar * Math.random(), scalar * Math.random(), 0);
const piOverTwo = Math.PI / 2;
const generateLines = ({
  lineCount = 20,
  stepLength = 0.5,
  turnAngle = (Math.PI * 2) / 32,
  zScalar = 20,
  xMax = 100,
  yMax = 100,
}) =>
  new Array(lineCount).fill(null).map(() => {
    const origin = getLineOrigin();

    let currX = origin.x;
    let currY = origin.y;
    let currZ = scaledNoise(currX, currY, 0);
    const initZ = currZ;
    let heading = Math.random() * Math.PI * 2;

    const points = new Array(positionsPerLine)
      .fill(null)
      .map((_, i) => {
        //   if (Math.abs(initZ - currZ) > Infinity) return;
        if (currX > xMax || currX < -xMax || currY > yMax || currY < -yMax) return;
        let minDeltaZ = Infinity;
        let minHeading = heading;
        let minZ = -1;
        let minX = -1;
        let minY = -1;

        for (var theta = heading - piOverTwo; theta < heading + piOverTwo; theta += turnAngle) {
          // navigate x/y
          let newX = currX + stepLength * Math.cos(theta);
          let newY = currY + stepLength * Math.sin(theta);
          // find z at that new x/y
          let newZ = scaledNoise(newX, newY, 0);
          // see how much z changed
          let deltaZ = Math.abs(newZ - currZ);

          // if this is the minimal delta-z we've found, head in that direction
          if (deltaZ < minDeltaZ) {
            minDeltaZ = deltaZ;
            minHeading = theta;
            minZ = newZ;
            minX = newX;
            minY = newY;
          }
        }

        currX = minX;
        currY = minY;
        currZ = minZ;
        heading = minHeading;

        return new THREE.Vector3(currX, currY, Math.abs(initZ) * zScalar - 10);
      })
      .filter(line => line);

    if (points.length === 0) return [];

    const vertices = new THREE.CatmullRomCurve3(points).getPoints(
      Math.min(lineDivisions, points.length),
    );

    return vertices;
  });

const colors = ['#e36bae', '#d89cf6', '#ffba93', '#ff8e71', '#c6fced'];

export function CountourLines() {
  const zScalar = 50;
  const lines = useMemo(() => generateLines({ zScalar }), []);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          color={
            colorScale(line[0].z / zScalar)
            // colors[Math.floor(colors.length * Math.random())]
          }
          vertices={line}
        />
      ))}
    </>
  );
}

function Line({ vertices, width = 0.5, color, speed = 0.0002, animate = false }) {
  const material = useRef<any>();
  useFrame(() => {
    if (animate && material.current) {
      material.current.uniforms.dashOffset.value -= speed;
    }
  });
  return (
    <mesh castShadow raycast={meshline.MeshLineRaycast}>
      {/** @ts-expect-error meshline not a jsx element */}
      <meshLine attach="geometry" vertices={vertices} />
      {/** @ts-expect-error */}
      <meshLineMaterial
        // castShadow
        attach="material"
        ref={material}
        transparent
        depthTest
        lineWidth={width}
        color={color}
        dashArray={animate ? 0.6 : undefined}
        dashRatio={animate ? 0.1 : undefined}
      />

      {/* <meshPhysicalMaterial color={color} clearcoat={1} clearcoatRoughness={0} roughness={0} /> */}
    </mesh>
  );
}
