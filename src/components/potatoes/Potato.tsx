import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../utils/getStaticUrl';
import ToonOutlineMesh from './ToonOutlineMesh';
import { Vis as PotatoVis } from './PotatoVis';
import potatoData from './potatoData';
import { usePotatoPositioning } from './Layout';
import HorizontalAxisLine from './HorizontalAxisLine';
import Text from './Text';

type GLTFResult = GLTF & {
  nodes: {
    potato001: THREE.Mesh;
  };
  materials: {};
};

type PotatoProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

const modelUrl = getStaticUrl('/static/models/potatoes/potato.gltf');

function Potato({ stroke, fill }: PotatoProps) {
  const { nodes } = (useGLTF(modelUrl) as unknown) as GLTFResult;

  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('potato');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh
        ref={modelRef}
        uniformsRef={uniformsRef}
        geometry={nodes.potato001.geometry}
      />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={nodes.potato001.geometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.potato}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Potato
      </Text>
    </group>
  );
}

export default Potato;

useGLTF.preload(modelUrl);
