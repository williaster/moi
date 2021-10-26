import * as THREE from 'three';
import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import SplitWireframeMesh, { SplitWireframeProps } from '../SplitWireframeMesh';

const url = getStaticUrl('/static/models/potatoes/waffle.gltf');

type GLTFResult = GLTF & {
  nodes: {
    waffle_export: THREE.Mesh;
  };
  materials: {};
};

function Waffle(props: Omit<SplitWireframeProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return <SplitWireframeMesh {...props} ref={ref} geometry={nodes.waffle_export.geometry} />;
}

export default forwardRef(Waffle);

useGLTF.preload(url);
