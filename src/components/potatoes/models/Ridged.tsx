import * as THREE from 'three';
import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import SplitWireframeMesh, { SplitWireframeProps } from '../SplitWireframeMesh';

type GLTFResult = GLTF & {
  nodes: {
    ridged_export: THREE.Mesh;
  };
  materials: {};
};

const url = getStaticUrl('/static/models/potatoes/ridged.gltf');

function Ridged(props: Omit<SplitWireframeProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return <SplitWireframeMesh {...props} ref={ref} geometry={nodes.ridged_export.geometry} />;
}

export default forwardRef(Ridged);

useGLTF.preload(url);
