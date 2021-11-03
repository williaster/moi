import React, { forwardRef, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { scaleLinear, scaleLog } from '@visx/scale';

import { useScroll } from '@react-three/drei';
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
import { backgroundColorDark, textColorDark, textColorDarker, highlightColor } from './colors';
import getKeyframes from './utils/getCurve';
import { Vector3 } from 'three';

const numPotatoes = 7;
const titleViewportVertical = 0.24;
const axisViewportVertical = 0.05;
const modelViewportVertical = 1 - (titleViewportVertical + axisViewportVertical);
const axisWidth = 0.55;

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
const labelProps = {
  color: textColorDarker,
  fontSize: 2,
  anchorX: 'right',
} as const;

const modelScalar =
  (modelViewportVertical / numPotatoes) * // available space divided by number of potatoes
  0.1; // reduce the overall model scale by this amount because they are large

const splitMaterialScalar = 4;

const keyframes = {
  group: {
    positionYRows: getKeyframes([0, 1.065, 1.065, 1.065, 1.065, 1.065, 1.065]),
    positionYRatio: getKeyframes([1, 0, 0, 0, 0, 0, 0]),
    positionXZero: getKeyframes([0, 1, 1, 1, 1, 1, 1]),
    positionXZRotation: getKeyframes([1, 0, 0, 0, 0, 0, 0]),
    scaleBaseline: getKeyframes([0, 1, 1, 1, 1, 1, 1]),
    scaleSplashpage: getKeyframes([1, 0, 0, 0, 0, 0, 0]),
  },
  model: {
    positionX: getKeyframes([0, 0.5, 0.5, 0.3, 0.3, 0.3, 0.26]), // relative to viewport.width
    positionXRatio: getKeyframes([0, 0, 0, 0, 0, 0, 0]), // relative to ratio scale
    scale: getKeyframes([1.7, 0, 0, 0, 0.8, 0.8, 0.8]),
    scaleHighlight: getKeyframes([1.7, 2.5, 2.5, 2.5, 0.8, 0.8, 0.8]),
    splitMaterial: getKeyframes([1, 1, -1, -1, -1, -1, -1]),
    outlineThickness: getKeyframes([0.025, 0.025, 0.28, 0.28, 0.28, 0.28, 0.28]),
  },
  vis: {
    rotateY: getKeyframes([-0.5, -0.5, -0.5, -0.5, 0, 0, 0]), // relative to Math.PI
    rotateYHighlight: getKeyframes([-0.5, -0.5, -0.5, 0, 0, 0, 0]), // relative to Math.PI
    positionX: getKeyframes([0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.41]), // relative to viewport.width
    positionXRatio: getKeyframes([0, 0, 0, 0, 0, 0, 1]), // relative to ratio scale
    scale: getKeyframes([0, 0, 0, 0, 0.0015, 0.0015, 0.0015]),
    scaleHighlight: getKeyframes([0, 0, 0, 0.0035, 0.0015, 0.0015, 0.0015]),
  },
  line: {
    scaleX: getKeyframes([0, 0, 0, 0, 0, 1, 1]),
    positionX: getKeyframes([0.3, 0.3, 0.3, 0.41, 0.41, 0.41, 0.41]), // relative to viewport.width
  },
  label: {
    scale: getKeyframes([0.013, 0, 0, 0.014, 0.014, 0.014, 0.014]),
    positionX: getKeyframes([-0.075, 0.5, -0.2, -0.2, 0.19, 0.19, 0.19]), // relative to viewport.width
    positionY: getKeyframes([0, 0, 0, 0, 0, 0, 0]),
    rotateX: getKeyframes([-0.5, -0.5, -0.5, -0.5, 0, 0, 0]), // relative to Math.PI
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

// @TODO new file
const labelKeyFrames = {
  scale: {
    better: getKeyframes([0, 1, 0, 0, 0, 0, 0]),
    worse: getKeyframes([0, 1, 0, 0, 0, 0, 0]),
    friedUnfried: getKeyframes([0, 0, 1, 1, 0.6, 0, 0]),
  },
  x: {
    better: getKeyframes([0.5, 0.5, 0.5, 0, 0, 0, 0]),
    worse: getKeyframes([0.5, 0.5, 0.5, 0, 0, 0, 0]),
    friedUnfried: getKeyframes([0.47, 0.47, 0.47, 0.47, 0.68, 0.68, 0.68]),
  },
  y: {
    better: getKeyframes([0, 0, 0, 0, 0, 0, 0]),
    worse: getKeyframes([0.5, 0.36, 0.36, 0, 0, 0, 0]),
    friedUnfried: getKeyframes([-0.06, -0.06, -0.06, -0.06, -0.06, -0.05, -0.05]),
  },
};
export function useLabelPositioning() {
  // refs which are modified by this hook
  const betterRef = useRef<THREE.Group>();
  const worseRef = useRef<THREE.Group>();
  const friedUnfriedRef = useRef<THREE.Group>();

  const viewport = useThree(state => state.viewport);
  const scroll = useScroll();

  useFrame(() => {
    // better
    betterRef.current.scale.setScalar(labelKeyFrames.scale.better(scroll.offset));
    betterRef.current.position.x =
      -0.5 * viewport.width + // set to 0
      labelKeyFrames.x.better(scroll.offset) * viewport.width;

    betterRef.current.position.y =
      0.5 * viewport.height -
      (1 - modelViewportVertical) * viewport.height + // offset text at top
      labelKeyFrames.y.better(scroll.offset) * viewport.height;

    // worse
    worseRef.current.scale.setScalar(labelKeyFrames.scale.worse(scroll.offset));
    worseRef.current.position.x =
      -0.5 * viewport.width + // set to 0
      labelKeyFrames.x.worse(scroll.offset) * viewport.width;

    worseRef.current.position.y =
      0.5 * viewport.height -
      (1 - modelViewportVertical) * viewport.height -
      labelKeyFrames.y.worse(scroll.offset) * viewport.height;

    // fried unfried
    friedUnfriedRef.current.position.x =
      -0.5 * viewport.width + // set to 0
      labelKeyFrames.x.friedUnfried(scroll.offset) * viewport.width;
    friedUnfriedRef.current.position.y =
      0.5 * viewport.height -
      (1 - modelViewportVertical) * viewport.height -
      labelKeyFrames.y.friedUnfried(scroll.offset) * viewport.height; // offset text at top

    friedUnfriedRef.current.scale.setScalar(labelKeyFrames.scale.friedUnfried(scroll.offset));
  });

  return { betterRef, worseRef, friedUnfriedRef };
}

const xAxisVec3 = new Vector3(1, 0, 0);
const axisRotation = getKeyframes([1, 1, 1, 1, 1, 0, 0]);
const axisPositionY = getKeyframes([1, 1, 1, 1, 1.1, 1.1, 1.1]); // times height * title space

// @TODO new file
export function useAxisPositioning() {
  // refs which are modified by this hook
  const groupRef = useRef<THREE.Group>();
  const axisRef = useRef<THREE.Mesh>();

  const viewport = useThree(state => state.viewport);
  const scroll = useScroll();

  useFrame(() => {
    groupRef.current.position.y =
      0.5 * viewport.height - // 50% makes top coord = 0 for easier calculation for other refs
      axisPositionY(scroll.offset) * titleViewportVertical * viewport.height; // offset text at top;

    groupRef.current.position.x =
      -0.5 * viewport.width + // set to 0
      keyframes.line.positionX(scroll.offset) * viewport.width;

    // groupRef.current.scale.y = axisOpacity(scroll.offset);
    groupRef.current.rotation.x = 0.5 * Math.PI * axisRotation(scroll.offset);
  });

  return { axisRef, groupRef, axisWidth };
}

function usePotatoPositioning(potatoType: keyof typeof potatoData) {
  const shouldHighlight = potatoType === 'curly' || potatoType === 'potato';
  const position = useMemo(() => order.indexOf(potatoType), [potatoType]);

  // refs which are modified by this hook
  const groupRef = useRef<THREE.Group>();
  const modelRef = useRef<THREE.Mesh>();
  const visRef = useRef<THREE.Group>();
  const labelRef = useRef<THREE.Mesh>();
  const lineRef = useRef<THREE.Mesh>();
  const uniformsRef = useRef<{
    splitPosition: { value: number };
    outlineThickness: { value: number };
  }>();

  const viewport = useThree(state => state.viewport);
  const scroll = useScroll();

  // fried / unfried ratio scale
  const ratioScaleX = useMemo(
    () =>
      scaleLinear({
        domain: potatoFriedRatioExtent,
        range: [0, viewport.width * axisWidth],
      }),
    [viewport.getCurrentViewport().width],
  );
  // this is not meant to be visually accurate, but to spread potatoes
  // out across entire viewport hence log scale
  const ratioScaleY = useMemo(
    () =>
      scaleLog({
        domain: potatoFriedRatioExtent,
        range: [viewport.height * 0.6, 0],
      }),
    [viewport.getCurrentViewport().height],
  );

  const baseModelOffset = useMemo(
    () =>
      keyframes.model[shouldHighlight ? 'scaleHighlight' : 'scale'](1 - 0.01) *
      modelScalar *
      viewport.height,
    [viewport.height, shouldHighlight],
  );

  const potatoRatio = potatoData[potatoType].ratio;

  useFrame(({ clock }) => {
    const viewportMin = Math.min(viewport.width, viewport.height * 0.8);

    // group
    const groupRotationPosition =
      Math.PI * clock.elapsedTime * 0.18 + (1 / numPotatoes) * position * 10;

    const xPosition =
      keyframes.group.positionXZRotation(scroll.offset) *
      viewport.width *
      0.2 *
      (position / numPotatoes + 0.5) *
      Math.sin(groupRotationPosition);

    const zPosition =
      keyframes.group.positionXZRotation(scroll.offset) *
      viewport.width *
      0.1 *
      Math.cos(groupRotationPosition);

    const scalar =
      keyframes.group.scaleBaseline(scroll.offset) +
      keyframes.group.scaleSplashpage(scroll.offset) *
        keyframes.group.positionXZRotation(scroll.offset) *
        0.4 *
        (Math.abs(
          Math.cos(
            0.5 * groupRotationPosition, // 0.5* for double the period
          ),
        ) +
          1.8);

    groupRef.current.scale.setScalar(scalar);

    groupRef.current.position.x =
      keyframes.group.positionXZero(scroll.offset) * (-0.5 * viewport.width) + // set to 0
      xPosition;

    groupRef.current.position.z = zPosition + 5;

    groupRef.current.position.y =
      0.5 * viewport.height - // 50% makes top coord = 0 for easier calculation for other refs
      (1 - modelViewportVertical) * viewport.height - // offset text at top
      keyframes.group.positionYRows(scroll.offset) *
        (position / numPotatoes) *
        modelViewportVertical *
        viewport.height + // offset based on position
      keyframes.group.positionYRatio(scroll.offset) * -ratioScaleY(potatoRatio);

    // model
    modelRef.current.position.x =
      keyframes.model.positionX(scroll.offset) * viewport.width +
      keyframes.model.positionXRatio(scroll.offset) * ratioScaleX(potatoRatio);

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

    // model uniforms
    if (uniformsRef.current) {
      uniformsRef.current.splitPosition.value =
        keyframes.model.splitMaterial(scroll.offset) * splitMaterialScalar;
      uniformsRef.current.outlineThickness.value = keyframes.model.outlineThickness(scroll.offset);
    }

    // vis
    visRef.current.position.z = 10 * position; // @TODO would distort vis with a perspective camera
    visRef.current.position.x =
      keyframes.vis.positionX(scroll.offset) * viewport.width +
      keyframes.vis.positionXRatio(scroll.offset) * ratioScaleX(potatoRatio);

    if (shouldHighlight) {
      const modelScale =
        keyframes.model.scaleHighlight(scroll.offset) * modelScalar * viewport.height;
      visRef.current.position.y = (modelScale - baseModelOffset) * position;
      visRef.current.scale.setScalar(keyframes.vis.scaleHighlight(scroll.offset) * viewportMin);
    } else {
      visRef.current.scale.setScalar(keyframes.vis.scale(scroll.offset) * viewportMin);
    }

    // label
    labelRef.current.scale.setScalar(keyframes.label.scale(scroll.offset) * viewportMin);
    labelRef.current.position.x = keyframes.label.positionX(scroll.offset) * viewport.width;
    labelRef.current.position.z = 2 * position;
    // labelRef.current.setRotationFromAxisAngle(
    //   xAxisVec3,
    //   keyframes.label.rotateX(scroll.offset) * -Math.PI,
    // );

    // lines
    lineRef.current.position.x = keyframes.line.positionX(scroll.offset) * viewport.width;
    lineRef.current.scale.y = keyframes.line.scaleX(scroll.offset) ** 2;
  });

  return { groupRef, labelRef, visRef, modelRef, uniformsRef, lineRef };
}

const HorizontalLine = forwardRef((_, ref) => {
  const viewport = useThree(state => state.viewport);
  const geometry = useMemo(() => {
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, 0);
    triangleShape.lineTo(viewport.width * axisWidth, 0);
    triangleShape.lineTo(viewport.width * axisWidth, 0.3);
    triangleShape.lineTo(0, 0.3);
    triangleShape.lineTo(0, 0);
    return new THREE.ShapeGeometry(triangleShape);
  }, [viewport.width]);
  return (
    // set z behind models
    <mesh ref={ref} position={[0, 0, -2]} geometry={geometry}>
      <meshBasicMaterial color={highlightColor} />
    </mesh>
  );
});

const VerticalLine = forwardRef((_, ref) => {
  const viewport = useThree(state => state.viewport);
  const height = 0.6 * viewport.height;
  return (
    <mesh ref={ref} position={[0, -height * 0.5, 0]}>
      <meshBasicMaterial color={textColorDark} />
      <planeBufferGeometry args={[0.5, height]} />
    </mesh>
  );
});

export function RidgedComplete() {
  const { groupRef, labelRef, visRef, modelRef, uniformsRef, lineRef } = usePotatoPositioning(
    'ridged',
  );
  return (
    <group ref={groupRef}>
      <RidgedModel ref={modelRef} uniformsRef={uniformsRef} {...potatoProps} />
      <RidgedVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Ridged chip
      </Text>
    </group>
  );
}

export function WaffleComplete() {
  const { groupRef, labelRef, visRef, modelRef, uniformsRef, lineRef } = usePotatoPositioning(
    'waffle',
  );
  return (
    <group ref={groupRef}>
      <WaffleModel ref={modelRef} uniformsRef={uniformsRef} {...potatoProps} />
      <WaffleVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Waffle fry
      </Text>
    </group>
  );
}

export function CurlyComplete() {
  const { groupRef, labelRef, visRef, modelRef, uniformsRef, lineRef } = usePotatoPositioning(
    'curly',
  );
  return (
    <>
      <group ref={groupRef}>
        <CurlyModel ref={modelRef} uniformsRef={uniformsRef} {...potatoProps} />
        <CurlyVis ref={visRef} {...visProps} />
        <HorizontalLine ref={lineRef} />
        <Text ref={labelRef} {...labelProps}>
          Curly fry
        </Text>
      </group>
    </>
  );
}

export function FryComplete() {
  const { groupRef, labelRef, visRef, modelRef, uniformsRef, lineRef } = usePotatoPositioning(
    'fry',
  );
  return (
    <group ref={groupRef}>
      <FryModel ref={modelRef} uniformsRef={uniformsRef} {...potatoProps} />
      <FryVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Fry
      </Text>
    </group>
  );
}

export function TotComplete() {
  const { groupRef, labelRef, visRef, modelRef, uniformsRef, lineRef } = usePotatoPositioning(
    'tot',
  );
  return (
    <group ref={groupRef}>
      <TotModel ref={modelRef} uniformsRef={uniformsRef} {...potatoProps} />
      <TotVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Tater tot
      </Text>
    </group>
  );
}

export function WedgeComplete() {
  const { groupRef, labelRef, visRef, modelRef, uniformsRef, lineRef } = usePotatoPositioning(
    'wedge',
  );
  return (
    <group ref={groupRef}>
      <WedgeModel ref={modelRef} uniformsRef={uniformsRef} {...potatoProps} />
      <WedgeVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Potato wedge
      </Text>
    </group>
  );
}

export function PotatoComplete() {
  const { groupRef, labelRef, visRef, modelRef, uniformsRef, lineRef } = usePotatoPositioning(
    'potato',
  );
  return (
    <group ref={groupRef}>
      <PotatoModel ref={modelRef} uniformsRef={uniformsRef} {...potatoProps} />
      <PotatoVis ref={visRef} {...visProps} />
      <HorizontalLine ref={lineRef} />
      <Text ref={labelRef} {...labelProps}>
        Potato
      </Text>
    </group>
  );
}
