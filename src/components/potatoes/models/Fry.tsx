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
    straightexport: THREE.Mesh;
  };
  materials: {};
};

type FryProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

const modelUrl = getStaticUrl('/static/models/potatoes/fry.gltf');

function Fry({ stroke, fill }: FryProps) {
  const { nodes } = (useGLTF(modelUrl) as unknown) as GLTFResult;

  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('fry');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh
        ref={modelRef}
        uniformsRef={uniformsRef}
        geometry={nodes.straightexport.geometry}
      />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={nodes.straightexport.geometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.fry}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Fry
      </Text>
    </group>
  );
}

export default Fry;

useGLTF.preload(modelUrl);
