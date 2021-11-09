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
    wedge_export: THREE.Mesh;
  };
  materials: {};
};

type WedgeProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

const modelUrl = getStaticUrl('/static/models/potatoes/wedge.gltf');

function Wedge({ stroke, fill }: WedgeProps) {
  const { nodes } = (useGLTF(modelUrl) as unknown) as GLTFResult;

  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('wedge');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh
        ref={modelRef}
        uniformsRef={uniformsRef}
        geometry={nodes.wedge_export.geometry}
      />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={nodes.wedge_export.geometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.wedge}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Potato wedge
      </Text>
    </group>
  );
}

export default Wedge;

useGLTF.preload(modelUrl);