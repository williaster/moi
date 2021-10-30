import React, { forwardRef, useEffect, useRef } from 'react';
import { scaleLinear } from '@visx/scale';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
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
  ringRef?: React.RefObject<THREE.Mesh>;
};
type SomeVisProps = Pick<VisProps, 'stroke' | 'fill'>;

export const Vis = forwardRef(
  ({ fill, stroke, datum, gap = 1, segments = 50, ringRef = React.createRef() }: VisProps, ref) => {
    const v = volume(datum);
    const a = area(datum);
    const volumeRadius = volumeScale(v);
    const areaRadius = Math.sqrt((a + Math.PI * volumeRadius * volumeRadius) / Math.PI);
    // useFrame(({ clock }) => {
    //   ringRef.current.geometry?.dispose();
    //   ringRef.current.geometry = new THREE.RingBufferGeometry(
    //     volumeRadius + gap,
    //     volumeRadius + gap + (areaRadius - volumeRadius + gap) * Math.sin(clock.elapsedTime * 0.5),
    //     segments,
    //     1,
    //     // 0,
    //     // 2 * Math.PI * Math.sin(clock.elapsedTime * 0.5),
    //   );
    //   // ringRef.current.scale.setScalar(Math.sin(clock.elapsedTime * 0.5));
    // });
    return (
      <group ref={ref}>
        <mesh>
          <ringBufferGeometry args={[0, volumeRadius, segments, Math.floor(segments * 0.1)]} />
          <meshBasicMaterial color={fill} />
        </mesh>
        <mesh ref={ringRef} position-z={0.2}>
          <ringBufferGeometry args={[volumeRadius + gap, areaRadius, segments, 1]} />
          <meshBasicMaterial color={stroke} />
        </mesh>
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
