/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../utils/getStaticUrl';

type GLTFResult = GLTF & {
  nodes: {
    curly_fry_export: THREE.Mesh;
  };
  materials: {};
};

const url = getStaticUrl('/static/models/potatoes/curly.gltf');

export default function Model({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>();
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh scale={[0.1, 0.1, 0.1]} geometry={nodes.curly_fry_export.geometry}>
        <meshBasicMaterial color="#fff" wireframe />
      </mesh>
    </group>
  );
}

useGLTF.preload(url);
