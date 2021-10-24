import React, { useRef } from 'react';
import { scaleLinear } from '@visx/scale';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import potatoData from './potatoData';

const dataArray = Object.values(potatoData);

type Datum = typeof potatoData['potato'];

// area should scale as the sqrt
const volume = (d: Datum) => Math.sqrt(d.volume);
const area = (d: Datum) => Math.sqrt(d.area);

const volumeScale = scaleLinear({
  domain: [Math.min(...dataArray.map(volume)), Math.max(...dataArray.map(volume))],
  range: [1, 50],
});

type VisProps = { fill: string; stroke: string; datum: Datum; gap?: number; segments?: number };
type SomeVisProps = Pick<VisProps, 'stroke' | 'fill'>;

export function Vis({ fill, stroke, datum, gap = 1, segments = 20 }: VisProps) {
  const v = volume(datum);
  const a = area(datum);
  const volumeRadius = volumeScale(v);
  const areaRadius = Math.sqrt((a + Math.PI * volumeRadius * volumeRadius) / Math.PI);

  return (
    <group>
      <mesh>
        <ringBufferGeometry args={[0, volumeRadius, segments, segments]} />
        <meshStandardMaterial
          flatShading
          roughness={0.4}
          metalness={0.5}
          color={fill}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <ringBufferGeometry
          args={[volumeRadius + gap, areaRadius, segments, Math.floor(segments * 0.1)]}
        />
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.5}
          color={stroke}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export const PotatoVis = (props: SomeVisProps) => <Vis {...props} datum={potatoData.potato} />;
export const WedgeVis = (props: SomeVisProps) => <Vis {...props} datum={potatoData.wedge} />;
export const TotVis = (props: SomeVisProps) => <Vis {...props} datum={potatoData.tot} />;
export const FryVis = (props: SomeVisProps) => <Vis {...props} datum={potatoData.fry} />;
export const CurlyVis = (props: SomeVisProps) => <Vis {...props} datum={potatoData.curly} />;
export const WaffleVis = (props: SomeVisProps) => <Vis {...props} datum={potatoData.waffle} />;
export const RidgedVis = (props: SomeVisProps) => <Vis {...props} datum={potatoData.ridged} />;
