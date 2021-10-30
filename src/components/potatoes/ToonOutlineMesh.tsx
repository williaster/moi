import { useThree, useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, forwardRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform mat4 rotationMatrix;
  uniform mat4 mvpMatrix;
  uniform bool isEdge;
  uniform vec3 stroke;

  varying vec4 vRotatedPosition;
  varying vec3 vNormal;
  varying vec4 vColor;
  varying bool vIsEdge;

  void main () {
    vec3 pos = position;
    if (isEdge) {
        pos += normal * 0.05;
    }
    vRotatedPosition = rotationMatrix * vec4(pos.xyz, 1.0);
    vNormal = normal;
    vColor = vec4(stroke, 1.0);
    vIsEdge = isEdge;

    gl_Position = projectionMatrix * modelViewMatrix * vRotatedPosition;
  }
`;
const fragmentShader = `
  uniform vec4 edgeColor;
  uniform mat4 invMatrix;
  uniform vec3 lightDirection;
  uniform sampler2D texture;

  varying vec3 vNormal;
  varying vec4 vColor;
  varying bool vIsEdge;

  void main() {
    if (vIsEdge) {
        gl_FragColor = edgeColor;
    } else {
        vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
        float diffuse  = clamp(dot(vNormal, invLight), 0.0, 1.0);
        vec4  smpColor = texture2D(texture, vec2(diffuse, 0.0));
        gl_FragColor   = vColor * smpColor;
    }
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
  const outlineRef = useRef<THREE.Mesh>();
  const didScale = useRef(false);
  useFrame(() => {
    // rotate mesh along y-axis
    rotationMatrix.current.value.makeRotationY(Math.PI * clock.elapsedTime * 0.1);
    // if (!didScale.current) {
    //   outlineRef.current.scale.setScalar(2.5);
    //   didScale.current = true;
    // }
  });

  return (
    // <group ref={ref}>
    //   <mesh ref={outlineRef} geometry={geometry} scale={new THREE.Vector3(1.05, 1.05, 1.05)}>
    //     <meshBasicMaterial color="green" side={THREE.BackSide} />
    //   </mesh>
    //   <mesh geometry={geometry}>
    //     <meshToonMaterial color="purple" side={THREE.FrontSide} />
    //   </mesh>
    // </group>
    <mesh ref={ref} geometry={geometry}>
      <shaderMaterial
        key={Math.random()} // @todo remove, how to handle disposal?
        ref={materialRef}
        transparent
        side={THREE.FrontSide}
        uniforms={{}}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default forwardRef(ToonOutlineMesh);
