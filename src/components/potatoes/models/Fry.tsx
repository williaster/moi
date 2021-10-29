import * as THREE from 'three';
import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import SplitWireframeMesh, { SplitWireframeProps } from '../SplitWireframeMesh';

type GLTFResult = GLTF & {
  nodes: {
    straightexport: THREE.Mesh;
  };
  materials: {};
};

const url = getStaticUrl('/static/models/potatoes/fry.gltf');
const rotation = new THREE.Euler(0, 0, -0.02 * Math.PI);

function Fry(props: Omit<SplitWireframeProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return (
    <group rotation={rotation}>
      <SplitWireframeMesh ref={ref} {...props} geometry={nodes.straightexport.geometry} />
    </group>
  );
}

export default forwardRef(Fry);

useGLTF.preload(url);
