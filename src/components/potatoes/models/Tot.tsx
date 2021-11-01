import * as THREE from 'three';
import React, { forwardRef } from 'react';
import ToonOutlineMesh, { ToonOutlineProps } from '../ToonOutlineMesh';

const geometry = new THREE.CylinderBufferGeometry(1.5, 1.5, 3.5, 20, 1, false);

// while there is a model, might as well just use a cylinder...
function Tot(props: Omit<ToonOutlineProps, 'geometry'>, ref: React.ForwardedRef<THREE.Mesh>) {
  return (
    <ToonOutlineMesh
      {...props}
      ref={ref}
      rotation-x={Math.PI * 0.05}
      rotation-y={Math.PI * 0.05}
      rotation-z={Math.PI * 0.05}
      geometry={geometry}
    />
  );
}

export default forwardRef(Tot);
