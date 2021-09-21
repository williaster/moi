/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../utils/getStaticUrl';

const url = getStaticUrl('/static/models/potatoes/tot.gltf');

type GLTFResult = GLTF & {
  nodes: {
    totexport: THREE.Mesh;
  };
  materials: {};
};

export default function Model({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>();
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return (
    <group ref={group} {...props}>
      <mesh geometry={nodes.totexport.geometry} scale={[0.1, 0.1, 0.1]}>
        <meshBasicMaterial color="#fff" wireframe />
      </mesh>
    </group>
  );
}

useGLTF.preload(url);
