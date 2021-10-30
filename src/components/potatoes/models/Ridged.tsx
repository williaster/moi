import * as THREE from 'three';
import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import ToonOutlineMesh, { ToonOutlineProps } from '../ToonOutlineMesh';

type GLTFResult = GLTF & {
  nodes: {
    ridged_export: THREE.Mesh;
  };
  materials: {};
};

const url = getStaticUrl('/static/models/potatoes/ridged.gltf');

function Ridged(props: Omit<ToonOutlineProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return <ToonOutlineMesh {...props} ref={ref} geometry={nodes.ridged_export.geometry} />;
}

export default forwardRef(Ridged);

useGLTF.preload(url);
