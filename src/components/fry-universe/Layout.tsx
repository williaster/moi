import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { scaleLinear, scaleLog } from '@visx/scale';
import { useScroll } from '@react-three/drei';

import potatoData from './potatoData';
import getKeyframes from './utils/getKeyframes';
import getViewportWidth from './utils/getViewportWidth';

const numPotatoes = 7;
const numPages = 8;
const titleViewportVertical = 0.22;
const axisViewportVertical = 0.05;
const modelViewportVertical = 1 - (titleViewportVertical + axisViewportVertical);
export const axisWidth = 0.55;

// min/max values of fried ratio
const potatoFriedRatioExtent = Object.keys(potatoData).reduce(
  (curr, key) => {
    curr[0] = Math.min(curr[0], potatoData[key].ratio);
    curr[1] = Math.max(curr[1], potatoData[key].ratio);
    return curr;
  },
  [Infinity, -Infinity],
);

const modelScalar =
  (modelViewportVertical / numPotatoes) * // available space divided by number of potatoes
  0.1; // reduce the overall model scale by this amount because they are large

const splitMaterialScalar = 4;

const keyframes = {
  group: {
    positionYRows: getKeyframes([0, 1.065, 1.065, 1.065, 1.065, 1.065, 1.065, 1.065]),
    positionYRatio: getKeyframes([1, 0, 0, 0, 0, 0, 0, 0]),
    positionXZero: getKeyframes([0, 1, 1, 1, 1, 1, 1, 0]),
    positionXZRotation: getKeyframes([1, 0, 0, 0, 0, 0, 0, 1]),
    scaleBaseline: getKeyframes([0, 1, 1, 1, 1, 1, 1, { step: 0, ease: 'easeInOutCubic' }]),
    scaleSplashpage: getKeyframes([1.3, { step: 0, ease: 'easeOutQuad' }, 0, 0, 0, 0, 0, 0]),
  },
  model: {
    positionX: getKeyframes([
      0,
      0.5,
      0.5,
      0.5,
      { steps: [0.5, 0.3], ease: 'easeInCubic' },
      0.3,
      0.26,
      0.5,
    ]), // relative to morphPosition
    positionXHighlight: getKeyframes([
      0,
      0.5,
      0.5,
      { step: 0.3, ease: 'easeInCubic' },
      0.3,
      0.3,
      0.26,
      0.5,
    ]), // relative to morphPosition
    positionXRatio: getKeyframes([0, 0, 0, 0, 0, 0, 0, 0]), // relative to ratio scale
    scale: getKeyframes([
      1.7,
      0,
      0,
      0,
      { steps: [0, 1.3, 1.3, 0.8], ease: 'easeOutCubic' },
      0.8,
      0.8,
      0,
    ]),
    scaleHighlight: getKeyframes([
      1.7,
      2.5,
      2.5,
      2.5,
      { steps: [0.8, 0.8], ease: 'linear' },
      0.8,
      0.8,
      0,
    ]),
    splitMaterial: getKeyframes([1, 1, -1, -1, -1, -1, -1, -1]),
    outlineThickness: getKeyframes([0.025, 0.025, 0.28, 0.28, 0.28, 0.28, 0.28, 0]),
  },
  vis: {
    positionXRatio: getKeyframes([0, 0, 0, 0, 0, 0, 1, 1]), // relative to ratio scale
    positionX: getKeyframes([
      0.5,
      0.5,
      0.5,
      0.5,
      { steps: [0.5, 0.7], ease: 'easeInCubic' },
      0.7,
      0.41,
      0.5,
    ]), // relative to morphPosition
    scale: getKeyframes([
      0,
      0,
      0,
      0.00095,
      { steps: [0.00095, 0.0025, 0.0015], ease: 'easeInCubic' },
      0.0015,
      0.0015,
      0,
    ]),
    morph: getKeyframes([0, 0, 0, 0, { steps: [0, 0.2, 1], ease: 'easeInCubic' }, 1, 1, 0]),

    positionXHighlight: getKeyframes([
      0.5,
      0.5,
      0.5,
      { steps: [0.5, 0.7], ease: 'easeInCubic' },
      0.7,
      0.7,
      0.41,
      0.5,
    ]), // relative to morphPosition
    scaleHighlight: getKeyframes([
      0,
      0,
      0.004,
      { step: 0.004, ease: 'easeInQuint' },
      { steps: [0.0015, 0.0015], ease: 'easeInOutQuad' },
      0.0015,
      0.0015,
      0,
    ]),
    morphHighlight: getKeyframes([0, 0, 0, { steps: [0, 1], ease: 'easeInCubic' }, 1, 1, 1, 0]),
  },
  line: {
    scaleX: getKeyframes([0, 0, 0, 0, 0, 1, 1, 1]),
    positionX: getKeyframes([0.3, 0.3, 0.3, 0.41, 0.41, 0.41, 0.41, 0.41]),
  },
  label: {
    scale: getKeyframes([0.024, 0, 0, 0, 0.024, 0.024, 0.024, 0]),
    positionX: getKeyframes([-0.075, 0, 0, 0.19, 0.19, 0.19, 0.19, 0.19]),
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
    better: getKeyframes([0, 1, 0, 0, 0, 0, 0, 0], 'easeInOutCubic'),
    worse: getKeyframes([0, 1, 0, 0, 0, 0, 0, 0], 'easeInOutCubic'),
    friedUnfried: getKeyframes(
      [0, 0, 1, 1, { step: 0, ease: 'easeInOutQuint' }, 0, 0, 0],
      'easeInOutCubic',
    ),
  },
  x: {
    better: getKeyframes([0.5, 0.5, 0.5, 0, 0, 0, 0, 0]),
    worse: getKeyframes([0.5, 0.5, 0.5, 0, 0, 0, 0, 0]),
    friedUnfried: getKeyframes([0.47, 0.47, 0.47, 0.47, 0.47, 0.47, 0.47, 0.47]),
  },
  y: {
    better: getKeyframes([0, 0, 0, 0, 0, 0, 0, 0]),
    worse: getKeyframes([0.5, 0.39, 0.39, 0, 0, 0, 0, 0]),
    friedUnfried: getKeyframes([-0.02, -0.02, -0.02, -0.02, 0, 0, 0, 0], 'easeInCubic'),
  },
};
export function useLabelPositioning() {
  // refs which are modified by this hook
  const betterRef = useRef<THREE.Group>();
  const worseRef = useRef<THREE.Group>();
  const friedUnfriedRef = useRef<THREE.Group>();

  const viewport = useThree(state => state.viewport);
  const viewportWidth = getViewportWidth(viewport.width, viewport.dpr);
  const scroll = useScroll();

  useFrame(() => {
    // better
    betterRef.current.scale.setScalar(labelKeyFrames.scale.better(scroll.offset));
    betterRef.current.position.x =
      -0.5 * viewportWidth + // set to 0
      labelKeyFrames.x.better(scroll.offset) * viewportWidth;

    betterRef.current.position.y =
      0.5 * viewport.height -
      (1 - modelViewportVertical) * viewport.height + // offset text at top
      labelKeyFrames.y.better(scroll.offset) * viewport.height;

    // worse
    worseRef.current.scale.setScalar(labelKeyFrames.scale.worse(scroll.offset));
    worseRef.current.position.x =
      -0.5 * viewportWidth + // set to 0
      labelKeyFrames.x.worse(scroll.offset) * viewportWidth;

    worseRef.current.position.y =
      0.5 * viewport.height -
      (1 - modelViewportVertical) * viewport.height -
      labelKeyFrames.y.worse(scroll.offset) * viewport.height;

    // fried unfried
    friedUnfriedRef.current.position.x =
      -0.5 * viewportWidth + // set to 0
      labelKeyFrames.x.friedUnfried(scroll.offset) * viewportWidth;
    friedUnfriedRef.current.position.y =
      0.5 * viewport.height -
      (1 - modelViewportVertical) * viewport.height -
      labelKeyFrames.y.friedUnfried(scroll.offset) * viewport.height * 1.1; // offset text at top

    friedUnfriedRef.current.scale.setScalar(labelKeyFrames.scale.friedUnfried(scroll.offset));
  });

  return { betterRef, worseRef, friedUnfriedRef };
}

const axisRotation = getKeyframes(
  [1, 1, 1, 1, 1, { steps: [1, 0], ease: 'easeInOutCubic' }, 0, 1],
  'easeInOutCubic',
);
const axisPositionY = getKeyframes([1, 1, 1, 1, 1.1, 1.1, 1.1, 1.1]); // times height * title space

export function useAxisPositioning() {
  // refs which are modified by this hook
  const groupRef = useRef<THREE.Group>();
  const axisRef = useRef<THREE.Mesh>();

  const viewport = useThree(state => state.viewport);
  const viewportWidth = getViewportWidth(viewport.width, viewport.dpr);
  const scroll = useScroll();

  useFrame(() => {
    groupRef.current.position.y =
      0.5 * viewport.height - // 50% makes top coord = 0 for easier calculation for other refs
      axisPositionY(scroll.offset) * titleViewportVertical * viewport.height; // offset text at top;

    groupRef.current.position.x =
      -0.5 * viewportWidth + // set to 0
      keyframes.line.positionX(scroll.offset) * viewportWidth;

    // groupRef.current.scale.y = axisOpacity(scroll.offset);
    groupRef.current.rotation.x = 0.5 * Math.PI * axisRotation(scroll.offset);
  });

  return { axisRef, groupRef, axisWidth };
}

export function usePotatoPositioning(potatoType: keyof typeof potatoData) {
  const shouldHighlight = potatoType === 'curly' || potatoType === 'potato';
  const position = useMemo(() => order.indexOf(potatoType), [potatoType]);

  // refs which are modified by this hook
  const groupRef = useRef<THREE.Group>();
  const modelRef = useRef<THREE.Mesh>();
  const visRef = useRef<THREE.Group>();
  const visMorphRef = useRef<{ value: number }>();
  const labelRef = useRef<THREE.Mesh>();
  const lineRef = useRef<THREE.Mesh>();
  const uniformsRef = useRef<{
    splitPosition: { value: number };
    outlineThickness: { value: number };
  }>();

  const viewport = useThree(state => state.viewport);
  const viewportWidth = getViewportWidth(viewport.width, viewport.dpr);
  const scroll = useScroll();
  console.log(viewport.width, viewport.dpr, viewportWidth);
  // fried / unfried ratio scale
  const ratioScaleX = useMemo(
    () =>
      scaleLinear({
        domain: potatoFriedRatioExtent,
        range: [0, viewportWidth * axisWidth],
      }),
    [viewportWidth],
  );
  // this is not meant to be visually accurate, but to spread potatoes
  // out across entire viewport hence log scale
  const ratioScaleY = useMemo(
    () =>
      scaleLog({
        domain: potatoFriedRatioExtent,
        range: [
          -viewport.height * 0.65,
          // when width is small, top text overflows down
          // so we need to take up less space with the vis
          viewportWidth * viewport.dpr <= 350 ? viewport.height * -0.05 : 0,
        ],
      }),
    [viewportWidth, viewport.height, viewport.dpr],
  );

  const baseModelOffset = useMemo(
    () =>
      keyframes.model[shouldHighlight ? 'scaleHighlight' : 'scale'](
        (numPages - 1) / numPages - 0.01,
      ) *
      modelScalar *
      viewport.height,
    [viewport.height, shouldHighlight],
  );

  const potatoRatio = potatoData[potatoType].ratio;

  useFrame(({ clock }) => {
    const viewportMin = Math.min(viewportWidth, viewport.height * 0.8);

    // group
    const groupRotationPosition =
      Math.PI * clock.elapsedTime * 0.18 + (1 / numPotatoes) * position * 10;

    const xPosition =
      keyframes.group.positionXZRotation(scroll.offset) *
      viewportWidth *
      0.3 *
      (position / numPotatoes + 0.5) *
      Math.sin(groupRotationPosition);

    const zPosition =
      keyframes.group.positionXZRotation(scroll.offset) *
      viewportWidth *
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
      keyframes.group.positionXZero(scroll.offset) * (-0.5 * viewportWidth) + // set to 0
      xPosition;

    groupRef.current.position.z = zPosition + 5;

    groupRef.current.position.y =
      0.5 * viewport.height - // 50% makes top coord = 0 for easier calculation for other refs
      (1 - modelViewportVertical) * viewport.height - // offset text at top
      keyframes.group.positionYRows(scroll.offset) *
        (position / numPotatoes) *
        modelViewportVertical *
        0.98 *
        viewport.height + // offset based on position
      keyframes.group.positionYRatio(scroll.offset) * ratioScaleY(potatoRatio);

    // model
    modelRef.current.position.x =
      keyframes.model[shouldHighlight ? 'positionXHighlight' : 'positionX'](scroll.offset) *
        viewportWidth +
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
    visRef.current.position.z = 25; // @TODO would distort vis with a perspective camera
    visRef.current.position.x =
      keyframes.vis[shouldHighlight ? 'positionXHighlight' : 'positionX'](scroll.offset) *
        viewportWidth +
      keyframes.vis.positionXRatio(scroll.offset) * ratioScaleX(potatoRatio);

    if (shouldHighlight) {
      const modelScale =
        keyframes.model.scaleHighlight(scroll.offset) * modelScalar * viewport.height;
      visRef.current.position.y = (modelScale - baseModelOffset) * position;
      visRef.current.scale.setScalar(keyframes.vis.scaleHighlight(scroll.offset) * viewportMin);
    } else {
      visRef.current.scale.setScalar(keyframes.vis.scale(scroll.offset) * viewportMin);
    }

    if (visMorphRef.current) {
      visMorphRef.current.value = keyframes.vis[shouldHighlight ? 'morphHighlight' : 'morph'](
        scroll.offset,
      );
    }

    // label
    labelRef.current.scale.setScalar(keyframes.label.scale(scroll.offset) * viewportMin);
    labelRef.current.position.x = keyframes.label.positionX(scroll.offset) * viewportWidth;
    labelRef.current.position.z = 2 * position;

    // lines
    lineRef.current.position.x = keyframes.line.positionX(scroll.offset) * viewportWidth;
    lineRef.current.scale.y = keyframes.line.scaleX(scroll.offset) ** 2;
  });

  return { groupRef, labelRef, visRef, visMorphRef, modelRef, uniformsRef, lineRef };
}
