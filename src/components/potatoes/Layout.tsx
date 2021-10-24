import React, { forwardRef, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { scaleLinear } from '@visx/scale';

import { ScrollControls, useScroll } from '@react-three/drei';
import { Text } from './Text';
import { CurlyVis, FryVis, PotatoVis, RidgedVis, TotVis, WaffleVis, WedgeVis } from './PotatoVis';
import RidgedModel from './models/Ridged';
import CurlyModel from './models/Curly';
import PotatoModel from './models/Potato';
import WedgeModel from './models/Wedge';
import TotModel from './models/Tot';
import WaffleModel from './models/Waffle';
import FryModel from './models/Fry';
import potatoData from './potatoData';
import {
  backgroundColor,
  backgroundColorDark,
  textColor,
  textColorDark,
  textColorDarker,
} from './colors';
import getStepCurve from './utils/getCurve';

const numPotatoes = 7;
const numPages = 7;
const modelViewportVertical = 0.8;
const horizontalLineLength = 0.27;

// min/max values of fried ratio
const potatoFriedRatioExtent = Object.keys(potatoData).reduce(
  (curr, key) => {
    curr[0] = Math.min(curr[0], potatoData[key].ratio);
    curr[1] = Math.max(curr[1], potatoData[key].ratio);
    return curr;
  },
  [Infinity, -Infinity],
);

const potatoProps = {
  stroke: textColorDark,
  fill: backgroundColorDark,
  background: backgroundColorDark,
};
const visProps = {
  fill: backgroundColorDark,
  stroke: textColorDark,
};
const visGroupProps = {
  scale: 0.1,
  position: [15, 0, 0] as [number, number, number],
};
const labelProps = {
  color: textColorDarker,
  fontSize: 2,
  anchorX: 'left',
} as const;

const modelPositionXCurve = getStepCurve([0.06, 0.15, 0.15, 0.15, 0.15, 0.04, 0.04]); // relative to viewport.width
const modelPositionRatioXCurve = getStepCurve([1, 0, 0, 0, 0, 0, 0]); // relative to ratio scale

const visPositionXCurve = getStepCurve([0.06, 0.06, 0.1, 0.1, 0.1, 0.09, 0.09]); // relative to viewport.width
const visPositionRatioXCurve = getStepCurve([0, 0, 0, 0, 0, 0, 1]); // relative to ratio scale

const lineScaleCurve = getStepCurve([1, 0, 0, 0, 0, 1, 1]);

const modelScaleHighlightCurve = getStepCurve([1, 2.5, 2.5, 2.5, 1, 1, 1]);
const modelScaleNonHighlightCurve = getStepCurve([1, 0, 0, 0, 1, 1, 1]);

const labelPositionXCurve = getStepCurve([0.015, -0.1, -0.1, -0.1, 0.02, -0.1, -0.1]);

const visScaleHighlightCurve = getStepCurve([0, 0, 0, 0.2, 0.1, 0.1, 0.1]);
const visScaleNonHighlightCurve = getStepCurve([0, 0, 0, 0, 0.1, 0.1, 0.1]);

const splitMaterialCurve = getStepCurve([1, -1, 0, 0, 0, 0, 0]);

const order: (keyof typeof potatoData)[] = [
  'ridged',
  'waffle',
  'curly',
  'fry',
  'tot',
  'wedge',
  'potato',
];

function usePotatoPositioning(potatoType: keyof typeof potatoData) {
  const highlight = potatoType === 'curly' || potatoType === 'potato';
  const position = useMemo(() => order.indexOf(potatoType), [potatoType]);
  const groupRef = useRef<THREE.Group>();
  const modelRef = useRef<THREE.Mesh>();
  const visRef = useRef<THREE.Group>();
  const labelRef = useRef<THREE.Mesh>();
  const lineRef = useRef<THREE.Mesh>();

  const viewport = useThree(state => state.viewport);
  const scroll = useScroll();
  const ratioScale = useMemo(
    () =>
      scaleLinear({
        domain: potatoFriedRatioExtent,
        range: [0 - 10, viewport.width * horizontalLineLength - 5],
        nice: true,
      }),
    [viewport.getCurrentViewport().width],
  );

  useFrame(() => {
    const currPageFloat = scroll.offset * numPages;
    const currPage = Math.floor(currPageFloat);

    groupRef.current.position.x = -0.5 * viewport.width; // set to 0
    groupRef.current.position.y =
      0.5 * viewport.height - // 50% sets 0 to top
      (1 - modelViewportVertical) * viewport.height - // offset text at top
      (position / numPotatoes) * modelViewportVertical * viewport.height; // offset based on position;

    // scale each potato group
    const groupScale = (0.07 * viewport.height) / numPotatoes;
    groupRef.current.scale.setScalar(groupScale);

    if (highlight) {
      const modelScale = modelScaleHighlightCurve(scroll.offset);
      modelRef.current.scale.setScalar(modelScale);
      modelRef.current.position.y = (modelScale - 1) * position;
      visRef.current.position.y = (modelScale - 1) * position;
      visRef.current.scale.setScalar(visScaleHighlightCurve(scroll.offset));
    } else {
      modelRef.current.scale.setScalar(modelScaleNonHighlightCurve(scroll.offset));
      visRef.current.scale.setScalar(visScaleNonHighlightCurve(scroll.offset));
    }

    // label scale
    labelRef.current.position.x = labelPositionXCurve(scroll.offset) * viewport.width;

    // model position
    modelRef.current.position.x =
      modelPositionXCurve(scroll.offset) * viewport.width +
      modelPositionRatioXCurve(scroll.offset) * ratioScale(potatoData[potatoType].ratio);

    lineRef.current.position.x =
      visPositionXCurve(scroll.offset) * viewport.width +
      horizontalLineLength * 0.5 * viewport.width -
      5;

    lineRef.current.scale.x = lineScaleCurve(scroll.offset) ** 2;

    // vis position
    visRef.current.position.x =
      visPositionXCurve(scroll.offset) * viewport.width +
      visPositionRatioXCurve(scroll.offset) * ratioScale(potatoData[potatoType].ratio);

    modelRef.current.material.uniforms.splitPosition.value = splitMaterialCurve(scroll.offset) * 4;
  });

  return { groupRef, labelRef, visRef, modelRef, lineRef };
}

const HorizontalLine = forwardRef((_, ref) => {
  const viewport = useThree(state => state.viewport);
  return (
    // set z behind models
    <mesh ref={ref} position={[0, 0, -1]}>
      <meshBasicMaterial color={textColorDark} />
      <planeBufferGeometry args={[horizontalLineLength * viewport.width - 10, 0.1]} />
    </mesh>
  );
});

export function RidgedComplete() {
  const { groupRef, labelRef, visRef, modelRef, lineRef } = usePotatoPositioning('ridged');
  return (
    <group ref={groupRef}>
      <RidgedModel ref={modelRef} {...potatoProps} />
      <RidgedVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Ridged chip
      </Text>
    </group>
  );
}

export function WaffleComplete() {
  const { groupRef, labelRef, visRef, modelRef, lineRef } = usePotatoPositioning('waffle');
  return (
    <group ref={groupRef}>
      <WaffleModel ref={modelRef} {...potatoProps} />
      <WaffleVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Waffle fry
      </Text>
    </group>
  );
}

export function CurlyComplete() {
  const { groupRef, labelRef, visRef, modelRef, lineRef } = usePotatoPositioning('curly');
  return (
    <group ref={groupRef}>
      <CurlyModel ref={modelRef} {...potatoProps} />
      <CurlyVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Curly fry
      </Text>
    </group>
  );
}

export function FryComplete() {
  const { groupRef, labelRef, visRef, modelRef, lineRef } = usePotatoPositioning('fry');
  return (
    <group ref={groupRef}>
      <FryModel ref={modelRef} {...potatoProps} />
      <FryVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Fry
      </Text>
    </group>
  );
}

export function TotComplete() {
  const { groupRef, labelRef, visRef, modelRef, lineRef } = usePotatoPositioning('tot');
  return (
    <group ref={groupRef}>
      <TotModel ref={modelRef} {...potatoProps} />
      <TotVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Tater tot
      </Text>
    </group>
  );
}

export function WedgeComplete() {
  const { groupRef, labelRef, visRef, modelRef, lineRef } = usePotatoPositioning('wedge');
  return (
    <group ref={groupRef}>
      <WedgeModel ref={modelRef} {...potatoProps} />
      <WedgeVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Potato wedge
      </Text>
    </group>
  );
}

export function PotatoComplete() {
  const { groupRef, labelRef, visRef, modelRef, lineRef } = usePotatoPositioning('potato');
  return (
    <group ref={groupRef}>
      <PotatoModel ref={modelRef} {...potatoProps} />
      <PotatoVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Potato
      </Text>
    </group>
  );
}
