import * as THREE from 'three';
import React, { forwardRef, useRef } from 'react';
import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import SplitWireframeMesh, { SplitWireframeProps } from '../SplitWireframeMesh';

const url = getStaticUrl('/static/models/potatoes/wedge.gltf');

type GLTFResult = GLTF & {
  nodes: {
    wedge_export: THREE.Mesh;
  };
  materials: {};
};

function Wedge(props: Omit<SplitWireframeProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return <SplitWireframeMesh {...props} ref={ref} geometry={nodes.wedge_export.geometry} />;
}

export default forwardRef(Wedge);

useGLTF.preload(url);
