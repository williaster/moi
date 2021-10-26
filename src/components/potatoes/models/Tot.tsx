import * as THREE from 'three';
import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import SplitWireframeMesh, { SplitWireframeProps } from '../SplitWireframeMesh';

const url = getStaticUrl('/static/models/potatoes/tot.gltf');

type GLTFResult = GLTF & {
  nodes: {
    totexport: THREE.Mesh;
  };
  materials: {};
};

function Tot(props: Omit<SplitWireframeProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return <SplitWireframeMesh {...props} ref={ref} geometry={nodes.totexport.geometry} />;
}

export default forwardRef(Tot);

useGLTF.preload(url);
