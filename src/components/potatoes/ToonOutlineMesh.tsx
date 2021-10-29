import { useThree, useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, forwardRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform mat4 rotationMatrix;

  void main () {
    vRotatedPosition = rotationMatrix * vec4(position.xyz, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vRotatedPosition;
  }
`;
const fragmentShader = `
  void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.8, 1.0);
  }
}    
`;

export interface ToonOutlineProps {
  stroke: string;
  fill: string;
  background: string;
  geometry: THREE.BufferGeometry;
  materialRef?: React.RefObject<THREE.Material>;
}

function ToonOutlineMesh(
  { stroke, fill, background, geometry, materialRef }: ToonOutlineProps,
  ref: React.ForwardedRef<THREE.Mesh>,
) {
  const clock = useThree(state => state.clock);
  const rotationMatrix = useRef({ value: new THREE.Matrix4() });
  const splitPosition = useRef({ value: 0 });
  useFrame(() => {
    // rotate mesh along y-axis
    rotationMatrix.current.value.makeRotationY(Math.PI * clock.elapsedTime * 0.1);
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <shaderMaterial
        key={Math.random()} // @todo remove, how to handle disposal?
        ref={materialRef}
        transparent
        side={THREE.FrontSide}
        uniforms={{
          rotationMatrix: rotationMatrix.current,
          background: { value: new THREE.Color(background) },
          fill: { value: new THREE.Color(fill) },
          stroke: { value: new THREE.Color(stroke) },
          splitPosition: splitPosition.current,
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default forwardRef(ToonOutlineMesh);
