import * as THREE from 'three';
import React, { forwardRef, useMemo, useRef } from 'react';
import { useGLTF, useScroll } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import getStaticUrl from '../../../utils/getStaticUrl';
import SplitWireframeMesh, { SplitWireframeProps } from '../SplitWireframeMesh';
import { useFrame } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    curly_fry_export: THREE.Mesh;
  };
  materials: {};
};

const url = getStaticUrl('/static/models/potatoes/curly.gltf');

function Curly(props: Omit<SplitWireframeProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  const { nodes } = (useGLTF(url) as unknown) as GLTFResult;
  return <SplitWireframeMesh ref={ref} {...props} geometry={nodes.curly_fry_export.geometry} />;
}

export default forwardRef(Curly);

useGLTF.preload(url);
