import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Loader, Stats, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { scaleLinear } from '@visx/scale';

import Page from '../components/Page';
// import Potato from '../components/potatoes/models/Potato';
// import Wedge from '../components/potatoes/models/Wedge';
// import Tot from '../components/potatoes/models/Tot';
// import Fry from '../components/potatoes/models/Fry';
// import Curly from '../components/potatoes/models/Curly';
// import Waffle from '../components/potatoes/models/Waffle';
// import Ridged from '../components/potatoes/models/Ridged';
// import {
//   PotatoVis,
//   CurlyVis,
//   WaffleVis,
//   FryVis,
//   TotVis,
//   WedgeVis,
//   RidgedVis,
// } from '../components/potatoes/PotatoVis';
// import PotatoLegend from '../components/potatoes/PotatoLegend';
// import addBarycentricCoordinates from '../components/potatoes/utils/addBarycentricCoords';
// import simplexNoise4d from 'raw-loader!glslify-loader!../components/potatoes/shaders/simplexNoise4d.glsl';
import { Text } from '../components/potatoes/Text';
import potatoData from '../components/potatoes/potatoData';
import {
  CurlyComplete,
  PotatoComplete,
  RidgedComplete,
  WedgeComplete,
  TotComplete,
  FryComplete,
  WaffleComplete,
} from '../components/potatoes/Layout';

const backgroundColor = '#E0DEE3';
const backgroundColorDark = '#CECDD2';
const textColor = '#9493A3';
const textColorDark = '#413f5b';
const textColorDarker = '#1b1a39';

const loaderProps = {
  containerStyles: {
    background: backgroundColor,
    '::after': { content: 'POTATO RANKS', fontSize: '4em' },
  },
  innerStyles: { background: textColor },
  barStyles: { background: textColorDark },
  dataStyles: { color: textColorDark, fontSize: '0.7em' },
  initialState: () => true,
  dataInterpolation: (p: number) => `Loading ${p.toFixed(0)}%`,
};

const PotatoesPage = () => (
  <>
    <Page centerContent={false} showNav={false}>
      <div className="canvas">
        <Canvas
          orthographic
          camera={{ near: -100, far: 100, zoom: 3 }}
          gl={{ antialias: true }}
          dpr={Math.max(typeof window === 'undefined' ? 2 : window.devicePixelRatio, 2)}
        >
          <React.Suspense fallback={null}>
            <Scene />
          </React.Suspense>
          <Stats className="stats" />
        </Canvas>
        <Loader {...loaderProps} />
      </div>
    </Page>
    <style global jsx>{`
      .main {
        height: 100%;
        width: 100%;
        font-size: 0.8rem;
        background: ${backgroundColor};
        color: ${textColor};
        overflow: hidden;
      }
      .page {
        padding: 0;
      }
      .canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
      }
      .stats {
        top: initial !important;
        left: initial !important;
        bottom: 0;
        right: 0;
      }
    `}</style>
  </>
);

function Scene() {
  return (
    <ScrollControls damping={10} pages={7}>
      <Scroll html>
        <div style={{ padding: 32, lineHeight: '1em', fontSize: '2vh' }}>
          <div
            style={{
              fontSize: '2em',
              fontWeight: 700,
              padding: '0.5em 0 0',
              color: textColorDark,
            }}
          >
            Potato ranks 🥔
          </div>
          <p style={{ color: textColor }}>
            3D modeling of various potato forms enabled ranking by a quantitative heuristic:{' '}
            <strong style={{ color: textColorDark }}>the fried ratio</strong>.
            <br />
            <br />
            Scroll to find out more <span style={{ color: textColorDark }}>⬇</span>.
          </p>
        </div>
        <h1 style={{ position: 'absolute', left: 32, top: '100vh' }}>2nd page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '200vh' }}>3rd page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '300vh' }}>4th page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '400vh' }}>5th page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '500vh' }}>6th page</h1>
        <h1 style={{ position: 'absolute', left: 32, top: '600vh' }}>7th page</h1>
      </Scroll>
      <RidgedComplete />
      <WaffleComplete />
      <CurlyComplete />
      <FryComplete />
      <TotComplete />
      <WedgeComplete />
      <PotatoComplete />

      <ambientLight />
      <directionalLight
        position={[-10, 3, 10]}
        rotation={[Math.PI * 0.25, Math.PI, Math.PI * 0]}
        args={[backgroundColor, 1]}
      />
    </ScrollControls>
  );
}

// const potatoCount = 7;

// const potatoProps = {
//   stroke: textColorDark,
//   fill: backgroundColorDark,
//   background: backgroundColorDark,
// };
// const visProps = {
//   fill: backgroundColorDark,
//   stroke: textColorDark,
// };
// const visGroupProps = {
//   scale: 0.1,
//   position: [15, 0, 0] as [number, number, number],
// };
// const labelProps = {
//   color: textColorDarker,
//   fontSize: 2,
//   position: [-8, 0, 0] as [number, number, number],
//   anchorX: 'right',
// };

// function Vertical() {
//   const viewport = useThree(state => state.viewport);
//   const scale = (0.055 * viewport.height) / potatoCount;
//   const scaleVec3 = new THREE.Vector3(scale, scale, scale);
//   const heightFactor = 0.7;
//   const topTextMargin = 2;

//   const ratioScale = useMemo(
//     () =>
//       scaleLinear({
//         domain: [0, 0.2],
//         range: [10, 10 + viewport.width * 0.2],
//       }),
//     [viewport.width],
//   );

//   return (
//     <group position={[-viewport.width * 0.25, viewport.height * 0.25, 0]}>
//       <group
//         position={[0, topTextMargin - (0 / potatoCount) * viewport.height * heightFactor, 0]}
//         scale={scaleVec3}
//       >
//         <Ridged {...potatoProps} />
//         <group {...visGroupProps} position={[ratioScale(potatoData.ridged.ratio), 0, 0]}>
//           <RidgedVis {...visProps} />
//         </group>
//         <Text {...labelProps}>Ridged chip</Text>
//       </group>

//       <group
//         position={[0, topTextMargin - (1 / potatoCount) * viewport.height * heightFactor, 0]}
//         scale={scaleVec3}
//       >
//         <Waffle {...potatoProps} />
//         <group {...visGroupProps} position={[ratioScale(potatoData.waffle.ratio), 0, 0]}>
//           <WaffleVis {...visProps} />
//         </group>
//         <Text {...labelProps}>Waffle fry</Text>
//       </group>

//       <group
//         position={[0, topTextMargin - (2 / potatoCount) * viewport.height * heightFactor, 0]}
//         scale={scaleVec3}
//       >
//         <Curly {...potatoProps} />
//         <group {...visGroupProps} position={[ratioScale(potatoData.curly.ratio), 0, 0]}>
//           <CurlyVis {...visProps} />
//         </group>
//         <Text {...labelProps}>Curly fry</Text>
//       </group>

//       <group
//         position={[0, topTextMargin - (3 / potatoCount) * viewport.height * heightFactor, 0]}
//         scale={scaleVec3}
//       >
//         <Fry {...potatoProps} />
//         <group {...visGroupProps} position={[ratioScale(potatoData.fry.ratio), 0, 0]}>
//           <FryVis {...visProps} />
//         </group>
//         <Text {...labelProps}>Fry</Text>
//       </group>

//       <group
//         position={[0, topTextMargin - (4 / potatoCount) * viewport.height * heightFactor, 0]}
//         scale={scaleVec3}
//       >
//         <Tot {...potatoProps} />
//         <group {...visGroupProps} position={[ratioScale(potatoData.tot.ratio), 0, 0]}>
//           <TotVis {...visProps} />
//         </group>
//         <Text {...labelProps}>Tot</Text>
//       </group>

//       <group
//         position={[0, topTextMargin - (5 / potatoCount) * viewport.height * heightFactor, 0]}
//         scale={scaleVec3}
//       >
//         <Wedge {...potatoProps} />
//         <group {...visGroupProps} position={[ratioScale(potatoData.wedge.ratio), 0, 0]}>
//           <WedgeVis {...visProps} />
//         </group>
//         <Text {...labelProps}>Wedge</Text>
//       </group>

//       <group
//         position={[0, topTextMargin - (6 / potatoCount) * viewport.height * heightFactor, 0]}
//         scale={scaleVec3}
//       >
//         <Potato {...potatoProps} />
//         <group {...visGroupProps} position={[ratioScale(potatoData.potato.ratio), 0, 0]}>
//           <PotatoVis {...visProps} />
//         </group>
//         <Text {...labelProps}>Potato</Text>
//       </group>
//     </group>
//   );
// }

export default PotatoesPage;
