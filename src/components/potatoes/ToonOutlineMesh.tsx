import { useThree, useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, forwardRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import * as colors from './colors';

// refs
// https://www.geofx.com/graphics/nehe-three-js/lessons33-40/lesson37/lesson37.html
// https://wgld.org/d/webgl/w048.html
const vertexShader = `
  uniform mat4 rotationMatrix;
  uniform bool outline;

  varying vec3 vNormal;

  void main () {
    // rotate the normal so the light appears is constant
    vNormal = (rotationMatrix * vec4(normal, 1.0)).xyz;
    vec3 pos = position;
    if (outline) {
        return;
        pos += normal * 0.25; // scale
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
  geometry: THREE.BufferGeometry;
  uniformsRef?: React.MutableRefObject<{
    // 0 is middle of obj, obj size depends on geometry
    splitPosition: { value: number };
    // how thick the outline should be, value is scalar of model normals
    outlineThickness: { value: number };
  }>;
}

const lightDirection = new THREE.Vector3(0.7, 1, 1).normalize();
const lightColor = new THREE.Color('white').setScalar(1);
const outlineColor = { value: new THREE.Color(colors.textColorDarker) };
const fillColorNoHue = { value: new THREE.Color('#999') };
const fillColorHue = { value: new THREE.Color(colors.highlightColorLight) };

function ToonOutlineMesh(
  { geometry, uniformsRef }: ToonOutlineProps,
  ref: React.ForwardedRef<THREE.Mesh>,
) {
  const outlineThickness = useRef({ value: 0 });
  const outlineOpacity = useRef({ value: 1 });
  const splitPosition = useRef({ value: 0 });

  useEffect(() => {
    if (uniformsRef) {
      uniformsRef.current = {
        outlineThickness: outlineThickness.current,
        splitPosition: splitPosition.current,
      };
    }
  }, [uniformsRef]);

  const rotationMatrix = useRef({ value: new THREE.Matrix4() });
  useFrame(({ clock }) => {
    rotationMatrix.current.value.makeRotationY(Math.PI * clock.elapsedTime * 0.15);
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <shaderMaterial
          key={Math.random()} // @todo remove, how to handle disposal?
          transparent
          side={THREE.FrontSide}
          uniforms={{
            rotationMatrix: rotationMatrix.current,
            lightDirection: { value: lightDirection },
            lightColor: { value: lightColor },
            aboveSplitColor: fillColorNoHue,
            belowSplitColor: fillColorHue,
            numGradientSteps: { value: 3 },
            splitPosition: splitPosition.current,
          }}
          vertexShader={`
            uniform mat4 rotationMatrix;
      
            varying vec3 vNormal;
            varying vec4 vRotatedPosition;
          
            void main () {
              // rotate the normal so the light appears is constant
              vNormal = (rotationMatrix * vec4(normal, 1.0)).xyz;
              vRotatedPosition = rotationMatrix * vec4(position.xyz, 1.0);
              gl_Position = projectionMatrix * modelViewMatrix * vRotatedPosition;
            }
          `}
          fragmentShader={`
            uniform mat4 rotationMatrix;
            uniform vec3 lightColor;
            uniform vec3 belowSplitColor;
            uniform vec3 aboveSplitColor;
            uniform vec3 lightDirection;
            uniform float numGradientSteps;
            uniform float splitPosition;
          
            varying vec3 vNormal;
            varying vec4 vRotatedPosition;
          
            void main() {
              // toon shading
              vec4 lightDirectionV4 = viewMatrix * vec4(lightDirection, 0.0);
              vec3 lightDirectionNormalized = normalize(lightDirectionV4.xyz);
              float diffuse = dot(vNormal, lightDirectionNormalized);
          
              if (numGradientSteps > 0.0) {
                  float sign = diffuse < 0.0 ? 0.0 : 1.0;
                  diffuse = 
                    (floor((abs(diffuse) + 0.001) * numGradientSteps) / numGradientSteps) * sign + 
                    (1.0 / (numGradientSteps * 2.0)) + 
                    0.7;
              }

              vec3 color = vRotatedPosition.x >= splitPosition ? aboveSplitColor : belowSplitColor;

              gl_FragColor = vec4(color * lightColor * diffuse, 1.0);
            }
          `}
        />
      </mesh>
      <mesh geometry={geometry}>
        {/** Shader which renders a rotating outline */}
        <shaderMaterial
          key={Math.random()} // @TODO remove
          side={THREE.BackSide} // reverse culling!
          uniforms={{
            rotationMatrix: rotationMatrix.current,
            materialColor: outlineColor,
            outlineThickness: outlineThickness.current,
            outlineOpacity: outlineOpacity.current,
          }}
          vertexShader={`
            uniform mat4 rotationMatrix;
            uniform float outlineThickness;
          
            void main () {
              // rotate the normal so the light appears is constant
              vec3 pos = position;
              if (outlineThickness > 0.0) {
                pos += normal * outlineThickness; // scale
              }
              vec4 rotatedPosition = rotationMatrix * vec4(pos.xyz, 1.0);
              gl_Position = projectionMatrix * modelViewMatrix * rotatedPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 materialColor;
            uniform float outlineThickness;
            uniform float outlineOpacity;

            void main() {
              if (outlineThickness > 0.0 && outlineOpacity > 0.0) {
                gl_FragColor = vec4(materialColor * 10.0 * outlineThickness, outlineOpacity);
              } else {
                discard;
              }
            }
          `}
        />
      </mesh>
    </group>
  );
}

export default forwardRef(ToonOutlineMesh);
