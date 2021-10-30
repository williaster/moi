import * as THREE from 'three';
import React, { forwardRef, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import ToonOutlineMesh, { ToonOutlineProps } from '../ToonOutlineMesh';

// const url = getStaticUrl('/static/models/potatoes/tot.gltf');

// type GLTFResult = GLTF & {
//   nodes: {
//     totexport: THREE.Mesh;
//   };
//   materials: {};
// };
const geometry = new THREE.CylinderBufferGeometry(1.5, 1.5, 3.5, 20, 1, false);

function Tot(props: Omit<ToonOutlineProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  // const { nodes } = (useGLTF(url) as unknown) as GLTFResult;

  return (
    <group rotation-x={Math.PI * 0.1} rotation-y={Math.PI * -0.01} rotation-z={Math.PI * 0.0}>
      <ToonOutlineMesh {...props} ref={ref} geometry={geometry} />
    </group>
  );
}

export default forwardRef(Tot);

// useGLTF.preload(url);
