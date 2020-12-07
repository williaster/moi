import React, { useMemo, useRef, useState } from 'react';
import Page from '../components/Page';
import * as THREE from 'three';
import { extend, Canvas, useFrame } from 'react-three-fiber';
import * as meshline from 'threejs-meshline';

extend(meshline);

const LINE_COUNT = 30;
const POSITIONS_PER_LINE = 50;

function Scene() {
  let group = useRef();
  let theta = 0;
  // Hook into the render loop and rotate the scene along y-axis
  useFrame(() =>
    group.current?.rotation.set(
      THREE.Math.degToRad(45),
      5 * Math.sin(THREE.Math.degToRad((theta += 0.005))),
      0,
    ),
  );
  return (
    <group ref={group}>
      <Lines count={LINE_COUNT} colors={['#ffd9e8', '#de95ba', '#7f4a88', '#fecd1a']} />
    </group>
  );
}

function Lines({ count, colors }) {
  const lines = useMemo(
    () =>
      new Array(count).fill(null).map(() => {
        const pos = new THREE.Vector3(30 - 60 * Math.random(), -50, 10 - 20 * Math.random());
        const points = new Array(POSITIONS_PER_LINE).fill(null).map(() =>
          pos
            .add(
              new THREE.Vector3(
                2 - Math.random() * 4, // -2,2
                4 - Math.random() * 2, //  2,4 => move along the y-direction
                2 - Math.random() * 4, // -5,5
              ),
            )
            .clone(),
        );
        const curve = new THREE.CatmullRomCurve3(points).getPoints(500);
        return {
          color: colors[Math.floor(colors.length * Math.random())],
          width: Math.max(0.1, 0.3 * Math.random()),
          speed: Math.max(0.0001, 0.0005 * Math.random()),
          curve,
        };
      }),
    [colors, count],
  );
  return lines.map((props, index) => <Line key={index} {...props} />);
}

function Line({ curve, width, color, speed }) {
  const material = useRef();
  const [dashRatio] = useState(() => 0.8 - 0.5 * Math.random());
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

function HomePage() {
  return (
    <>
      <Page showNav={false}>
        <div className="canvas">
          <Canvas camera={{ position: [50, 0, 0], fov: 40 }}>
            <Scene />
          </Canvas>
        </div>
        <div className="home">
          <div>
            <h2>Hi, my name is Chris Williams.</h2>
            <p>I currently design and engineer data visualizations and interfaces at Airbnb.</p>
          </div>
        </div>
      </Page>
      <style global jsx>{`
        .home {
          display: flex;
          width: 100%;
          height: 80%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .home p {
          font-size: 1.25em;
          font-weight: 100;
        }

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

export default HomePage;
