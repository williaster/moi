import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { extend, Canvas, useFrame } from 'react-three-fiber';
import * as meshline from 'threejs-meshline';
import { colors as COLORS } from '../theme';

extend(meshline);

const LINE_COUNT = 30;
const POSITIONS_PER_LINE = 50;
const LINE_DIVISIONS = 500;
const getLineWidth = () => Math.max(0.1, 0.3 * Math.random());
const getLineSpeed = () => Math.max(0.0001, 0.0005 * Math.random());
const getDashRatio = () => 0.8 - 0.5 * Math.random(); // 0.3,0.8
const getLineOrigin = () =>
  new THREE.Vector3(30 - 60 * Math.random(), -50, 10 - 20 * Math.random());
const getLinePoint = () =>
  new THREE.Vector3(
    2 - Math.random() * 4, // -2,2
    4 - Math.random() * 2, //  2,4 => lines extend along the y-direction
    2 - Math.random() * 4, // -5,5
  );

function Lines({ count, colors }) {
  const lines = useMemo(
    () =>
      new Array(count).fill(null).map(() => {
        const origin = getLineOrigin();
        const points = new Array(POSITIONS_PER_LINE)
          .fill(null)
          .map(() => origin.add(getLinePoint()).clone());
        const curve = new THREE.CatmullRomCurve3(points).getPoints(LINE_DIVISIONS);

        return {
          color: colors[Math.floor(colors.length * Math.random())],
          width: getLineWidth(),
          speed: getLineSpeed(),
          curve,
        };
      }),
    [colors, count],
  );
  return lines.map((props, index) => <Line key={index} {...props} />);
}

function Line({ curve, width, color, speed }) {
  const material = useRef();
  const [dashRatio] = useState(getDashRatio);
  useFrame(() => (material.current.uniforms.dashOffset.value -= speed));
  return (
    <mesh>
      <meshLine attach="geometry" vertices={curve} />
      <meshLineMaterial
        attach="material"
        ref={material}
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={0.1}
        dashRatio={dashRatio}
      />
    </mesh>
  );
}

function Scene() {
  let group = useRef();
  let [theta] = useState(0);
  useFrame(() =>
    // rotate the scene along y-axis
    group.current?.rotation.set(
      THREE.Math.degToRad(-15),
      5 * Math.sin(THREE.Math.degToRad((theta += 0.01))),
      0,
    ),
  );
  return (
    <group ref={group}>
      <Lines count={LINE_COUNT} colors={COLORS} />
    </group>
  );
}

function HomeBackground() {
  return (
    <>
      <div className="canvas">
        <Canvas camera={{ position: [50, 0, 0], fov: 40 }}>
          <Scene />
        </Canvas>
      </div>
      <style global jsx>{`
        .canvas,
        canvas {
          opacity: 0.75;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          pointer-events: none;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default React.memo(HomeBackground);
