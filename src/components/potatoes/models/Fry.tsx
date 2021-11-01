import * as THREE from 'three';
import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import ToonOutlineMesh, { ToonOutlineProps } from '../ToonOutlineMesh';

type GLTFResult = GLTF & {
  nodes: {
    straightexport: THREE.Mesh;
  };
  materials: {};
};

const url = getStaticUrl('/static/models/potatoes/fry.gltf');

function Fry(props: Omit<ToonOutlineProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return (
    <ToonOutlineMesh
      ref={ref}
      position-y={-1}
      {...props}
      geometry={nodes.straightexport.geometry}
    />
  );
}

export default forwardRef(Fry);

useGLTF.preload(url);
