import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';

type GLTFResult = GLTF & {
  nodes: {
    ridged_export: THREE.Mesh;
  };
  materials: {};
};

type RidgedProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

const modelUrl = getStaticUrl('/static/models/potatoes/ridged.gltf');

function Ridged({ stroke, fill }: RidgedProps) {
  const { nodes } = (useGLTF(modelUrl) as unknown) as GLTFResult;

  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('ridged');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh
        ref={modelRef}
        uniformsRef={uniformsRef}
        geometry={nodes.ridged_export.geometry}
      />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={nodes.ridged_export.geometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.curly}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Ridged chip
      </Text>
    </group>
  );
}

export default Ridged;

useGLTF.preload(modelUrl);
