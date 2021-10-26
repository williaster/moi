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
  backgroundColorDark,
  textColorDark,
  textColorDarker,
  highlightColor,
  textColor,
} from './colors';
import getKeyframes from './utils/getCurve';
import { Vector3 } from 'three';

const numPotatoes = 7;
const modelViewportVertical = 0.8;
const horizontalLineLength = 0.615;

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

const modelScalar =
  (modelViewportVertical / numPotatoes) * // available space divided by number of potatoes
  0.1; // reduce the overall model scale by this amount because they are large

const splitMaterialScalar = 4;

const keyframes = {
  model: {
    positionX: getKeyframes([0.21, 0.5, 0.5, 0.35, 0.35, 0.21, 0.21]), // relative to viewport.width
    positionXRatio: getKeyframes([1, 0, 0, 0, 0, 0, 0]), // relative to ratio scale
    positionYHighlight: getKeyframes([0, 0.5, 0.5, 0, 0, 0, 0]), // offset from initial y
    scale: getKeyframes([1, 0, 0, 0, 0.8, 0.8, 0.8]),
    scaleHighlight: getKeyframes([1, 2.5, 2.5, 2.5, 0.8, 0.8, 0.8]),
    splitMaterial: getKeyframes([1, -1, 0, 0, 0, 0, 0]),
  },
  vis: {
    rotateY: getKeyframes([-0.5, -0.5, -0.5, -0.5, 0, 0, 0]), // relative to Math.PI
    rotateYHighlight: getKeyframes([-0.5, -0.5, -0.5, 0, 0, 0, 0]), // relative to Math.PI
    positionX: getKeyframes([0.7, 0.7, 0.7, 0.7, 0.7, 0.35, 0.35]), // relative to viewport.width
    positionXRatio: getKeyframes([0, 0, 0, 0, 0, 0, 1]), // relative to ratio scale
    scale: getKeyframes([0, 0, 0, 0.45, 0.45, 0.45, 0.45]),
    scaleHighlight: getKeyframes([0, 0, 0.9, 0.9, 0.45, 0.45, 0.45]),
  },
  line: {
    scaleX: getKeyframes([1, 0, 0, 0, 0, 1, 1]),
    positionX: getKeyframes([0.225, 0.225, 0.225, 0.225, 0.25, 0.35, 0.35]), // relative to viewport.width
  },
  label: {
    scale: getKeyframes([3, 3, 3, 3, 3, 3, 3]),
    positionX: getKeyframes([0.05, -0.2, -0.2, -0.2, 0.1, 0.05, 0.05]), // relative to viewport.width
    rotateX: getKeyframes([0, -0.5, -0.5, -0.5, 0, 0, 0]), // relative to Math.PI
  },
  splitLine: {
    scaleX: getKeyframes([0, 0, 1, 0.5, 0, 0, 0]), // relative to viewport.width
  },
};

// order of potatoes, this matches the fried ratio data
const order: (keyof typeof potatoData)[] = [
  'ridged',
  'waffle',
  'curly',
  'fry',
  'tot',
  'wedge',
  'potato',
];

const yAxisVec3 = new Vector3(0, 1, 0);
const xAxisVec3 = new Vector3(1, 0, 0);

function usePotatoPositioning(potatoType: keyof typeof potatoData) {
  const shouldHighlight = potatoType === 'curly' || potatoType === 'potato';
  const position = useMemo(() => order.indexOf(potatoType), [potatoType]);

  // refs which are modified by this hook
  const groupRef = useRef<THREE.Group>();
  const modelRef = useRef<THREE.Mesh>();
  const visRef = useRef<THREE.Group>();
  const labelRef = useRef<THREE.Mesh>();
  const lineRef = useRef<THREE.Mesh>();
  const splitRef = useRef<THREE.Mesh>();

  const viewport = useThree(state => state.viewport);
  const scroll = useScroll();

  // fried:unfried ratio scale
  const ratioScale = useMemo(
    () =>
      scaleLinear({
        domain: potatoFriedRatioExtent,
        range: [0, viewport.width * horizontalLineLength],
        nice: true,
      }),
    [viewport.getCurrentViewport().width],
  );

  const baseModelOffset = useMemo(
    () =>
      keyframes.model[shouldHighlight ? 'scaleHighlight' : 'scale'](0) *
      modelScalar *
      viewport.height,
    [viewport.height, shouldHighlight],
  );

  useFrame(() => {
    // group
    groupRef.current.position.x = -0.5 * viewport.width; // set to 0
    groupRef.current.position.y =
      0.5 * viewport.height - // 50% makes top coord = 0 for easier calculation for other refs
      (1 - modelViewportVertical) * viewport.height - // offset text at top
      (position / numPotatoes) * modelViewportVertical * viewport.height; // offset based on position;

    // model
    modelRef.current.position.x =
      keyframes.model.positionX(scroll.offset) * viewport.width +
      keyframes.model.positionXRatio(scroll.offset) * ratioScale(potatoData[potatoType].ratio);

    modelRef.current.material.uniforms.splitPosition.value =
      keyframes.model.splitMaterial(scroll.offset) * splitMaterialScalar;

    if (shouldHighlight) {
      const modelScale =
        keyframes.model.scaleHighlight(scroll.offset) * modelScalar * viewport.height;
      modelRef.current.scale.setScalar(modelScale);
      // offset y-value based on the amount scaled (increase y as scale increases)
      modelRef.current.position.y = (modelScale - baseModelOffset) * position;
    } else {
      modelRef.current.scale.setScalar(
        keyframes.model.scale(scroll.offset) * modelScalar * viewport.height,
      );
    }

    // vis
    visRef.current.position.z = 10 * position; // @TODO would distort vis with a perspective camera
    visRef.current.position.x =
      keyframes.vis.positionX(scroll.offset) * viewport.width +
      keyframes.vis.positionXRatio(scroll.offset) * ratioScale(potatoData[potatoType].ratio);

    if (shouldHighlight) {
      const modelScale =
        keyframes.model.scaleHighlight(scroll.offset) * modelScalar * viewport.height;
      visRef.current.position.y = (modelScale - baseModelOffset) * position;
      visRef.current.scale.setScalar(keyframes.vis.scaleHighlight(scroll.offset));

      visRef.current.setRotationFromAxisAngle(
        yAxisVec3,
        keyframes.vis.rotateYHighlight(scroll.offset) * Math.PI,
      );
    } else {
      visRef.current.scale.setScalar(keyframes.vis.scale(scroll.offset));
      visRef.current.setRotationFromAxisAngle(
        yAxisVec3,
        keyframes.vis.rotateY(scroll.offset) * Math.PI,
      );
    }

    // label
    labelRef.current.scale.setScalar(keyframes.label.scale(scroll.offset));
    labelRef.current.position.x = keyframes.label.positionX(0) * viewport.width;
    labelRef.current.setRotationFromAxisAngle(
      xAxisVec3,
      keyframes.label.rotateX(scroll.offset) * Math.PI,
    );

    // lines
    lineRef.current.position.x =
      keyframes.line.positionX(scroll.offset) * viewport.width +
      horizontalLineLength * 0.5 * viewport.width;

    lineRef.current.scale.y = keyframes.line.scaleX(scroll.offset) ** 2;

    if (splitRef.current) {
      splitRef.current.position.x =
        modelRef.current.position.x +
        keyframes.model.splitMaterial(scroll.offset) * splitMaterialScalar * 10;

      splitRef.current.scale.x = keyframes.splitLine.scaleX(scroll.offset);
    }
  });

  return { groupRef, labelRef, visRef, modelRef, lineRef, splitRef };
}

const HorizontalLine = forwardRef((_, ref) => {
  const viewport = useThree(state => state.viewport);
  return (
    // set z behind models
    <mesh ref={ref} position={[0, 0, -2]}>
      <meshBasicMaterial color={highlightColor} />
      <planeBufferGeometry args={[horizontalLineLength * viewport.width - 10, 0.2]} />
    </mesh>
  );
});
const VerticalLine = forwardRef((_, ref) => {
  const viewport = useThree(state => state.viewport);
  const height = modelViewportVertical * viewport.height - 10;
  return (
    <mesh ref={ref} position={[0, -(1 - modelViewportVertical) * viewport.height + 15, 0]}>
      <meshBasicMaterial color={textColorDark} />
      <planeBufferGeometry args={[0.5, height]} />
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
  const { groupRef, labelRef, visRef, modelRef, lineRef, splitRef } = usePotatoPositioning('curly');
  return (
    <group ref={groupRef}>
      <CurlyModel ref={modelRef} {...potatoProps} />
      <CurlyVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <VerticalLine ref={splitRef} />
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
