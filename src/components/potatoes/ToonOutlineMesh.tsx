import { useThree, useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, forwardRef } from 'react';
import * as THREE from 'three';
import * as colors from './colors';

const vertexShader = `
  uniform mat4 rotationMatrix;
  uniform bool outline;

  varying vec3 vNormal;

  void main () {
    // rotate the normal so the light appears is constant
    vNormal = (rotationMatrix * vec4(normal, 1.0)).xyz;
    vec3 pos = position;
    if (outline) {
        pos += normal * 0.15; // scale
    }
    vec4 rotatedPosition = rotationMatrix * vec4(pos.xyz, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * rotatedPosition;
  }
`;
const fragmentShader = `
  uniform mat4 rotationMatrix;
  uniform vec3 materialColor;
  uniform vec3 lightColor;
  uniform vec3 lightDirection;
  uniform float numGradientSteps;

  varying vec3 vNormal;

  void main() {
    vec4 lightDirectionV4 = viewMatrix * vec4(lightDirection, 0.0);
    vec3 lightDirectionNormalized = normalize(lightDirectionV4.xyz);

    float diffuse = dot(vNormal, lightDirectionNormalized);

    if (numGradientSteps > 0.0) {
        float sign = diffuse < 0.0 ? -1.0 : 1.0;
        diffuse = 
          (floor((abs(diffuse) + 0.001) * numGradientSteps) / numGradientSteps) * sign + 
          (1.0 / (numGradientSteps * 2.0)) + 
          0.1;
    }

    gl_FragColor = vec4(materialColor * lightColor * diffuse, 1.0);
  }
`;

export interface ToonOutlineProps {
  stroke: string;
  fill: string;
  background: string;
  geometry: THREE.BufferGeometry;
  materialRef?: React.RefObject<THREE.Material>;
}

const lightDirection = new THREE.Vector3(0.7, 0.8, 1).normalize();
const lightColor = new THREE.Color('pink').setScalar(3);
const materialColor = new THREE.Color(colors.highlightColor);

function ToonOutlineMesh(
  { stroke, fill, background, geometry, materialRef }: ToonOutlineProps,
  ref: React.ForwardedRef<THREE.Mesh>,
) {
  const rotationMatrix = useRef({ value: new THREE.Matrix4() });
  useFrame(({ clock }) => {
    rotationMatrix.current.value.makeRotationY(Math.PI * clock.elapsedTime * 0.15);
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <shaderMaterial
          key={Math.random()} // @todo remove, how to handle disposal?
          ref={materialRef}
          transparent
          side={THREE.FrontSide}
          uniforms={{
            rotationMatrix: rotationMatrix.current,
            lightDirection: { value: lightDirection },
            lightColor: { value: lightColor },
            materialColor: { value: new THREE.Color('#aaa') },
            numGradientSteps: { value: 2 },
            outline: { value: false },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <mesh geometry={geometry}>
        <shaderMaterial
          key={Math.random()} // @todo remove, how to handle disposal?
          ref={materialRef}
          transparent
          side={THREE.BackSide}
          uniforms={{
            rotationMatrix: rotationMatrix.current,
            lightDirection: { value: lightDirection },
            lightColor: { value: lightColor },
            materialColor: { value: new THREE.Color(colors.textColorDarker) },
            numGradientSteps: { value: 1 },
            outline: { value: true },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
}

export default forwardRef(ToonOutlineMesh);
