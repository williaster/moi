import { useThree, useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, forwardRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import * as colors from './colors';
import addBarycentricCoordinates from './utils/addBarycentricCoords';

// implementation refs
// https://www.geofx.com/graphics/nehe-three-js/lessons33-40/lesson37/lesson37.html
// https://wgld.org/d/webgl/w048.html

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
const backgroundColor = { value: new THREE.Color(colors.backgroundColor) };

const constantUniforms = {
  // toon shading
  lightDirection: { value: lightDirection },
  lightColor: { value: lightColor },
  backgroundColor,
  aboveSplitColor: fillColorNoHue,
  belowSplitColor: fillColorHue,
  numGradientSteps: { value: 3 },

  // wireframe
  seeThrough: { value: false },
  insideAltColor: { value: false },
  thickness: { value: 0.02 },
  squeeze: { value: true },
  squeezeMin: { value: 1.0 },
  squeezeMax: { value: 3.0 },
};

// needed for anti-alias smoothstep in aastep()
const shaderExtensions = { derivatives: true };

function ToonOutlineMesh(
  { geometry: initGeometry, uniformsRef, ...props }: ToonOutlineProps,
  ref: React.ForwardedRef<THREE.Mesh>,
) {
  const outlineThickness = useRef({ value: 0 });
  const outlineOpacity = useRef({ value: 1 });
  const splitPosition = useRef({ value: 0 });

  const geometry = useMemo(() => {
    // custom wireframe shader relies on barycentric coords which requires un-indexing
    const geo = initGeometry.toNonIndexed();
    addBarycentricCoordinates(geo);
    return geo;
  }, [initGeometry]);

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
      <mesh geometry={geometry} {...props}>
        {/** shader which renders a toon look */}
        <shaderMaterial
          key={Math.random()} // @todo remove, how to handle disposal?
          transparent
          // @ts-expect-error
          extensions={shaderExtensions}
          side={THREE.FrontSide}
          uniforms={{
            rotationMatrix: rotationMatrix.current,
            splitPosition: splitPosition.current,
            ...constantUniforms,
          }}
          vertexShader={`
            attribute vec3 barycentric;

            uniform mat4 rotationMatrix;
      
            varying vec3 vNormal;
            varying vec4 vRotatedPosition;
            varying vec3 vBarycentric;
          
            void main () {
              // rotate the normal so the light appears is constant
              vNormal = (rotationMatrix * vec4(normal, 1.0)).xyz;
              vRotatedPosition = rotationMatrix * vec4(position.xyz, 1.0);
              gl_Position = projectionMatrix * modelViewMatrix * vRotatedPosition;

              vBarycentric = barycentric;
            }
          `}
          fragmentShader={`
            // shading
            uniform mat4 rotationMatrix;
            uniform vec3 lightColor;
            uniform vec3 backgroundColor;
            uniform vec3 belowSplitColor;
            uniform vec3 aboveSplitColor;
            uniform vec3 lightDirection;
            uniform float numGradientSteps;
            uniform float splitPosition;
            
            // wireframe
            uniform bool seeThrough;
            uniform bool insideAltColor;
            uniform bool squeeze;
            uniform float thickness;
            uniform float squeezeMin;
            uniform float squeezeMax;
          
            varying vec3 vBarycentric;
            varying vec3 vNormal;
            varying vec4 vRotatedPosition;

            float PI = 3.14159265359;
  
            float antiAliasStep (float threshold, float dist) {
              float afwidth = fwidth(dist) * 0.5;
              return smoothstep(threshold - afwidth, threshold + afwidth, dist);
            }
 
            // This function returns the fragment color for our styled wireframe effect
            // based on the barycentric coordinates for this fragment
            vec4 getStyledWireframe (
              vec3 barycentric, 
              vec3 fill, 
              vec3 stroke, 
              vec3 background, 
              bool squeeze, 
              float thickness
            ) {
              // this will be our signed distance for the wireframe edge
              float d = min(min(barycentric.x, barycentric.y), barycentric.z);
              
              // for dashed rendering, we can use this to get the 0 .. 1 value of the line length
              float positionAlong = max(barycentric.x, barycentric.y);
              if (barycentric.y < barycentric.x && barycentric.y < barycentric.z) {
                positionAlong = 1.0 - positionAlong;
              }
              
              // the thickness of the stroke
              float computedThickness = thickness;
              // if we want to shrink the thickness toward the center of the line segment
              if (squeeze) {
                computedThickness *= mix(squeezeMin, squeezeMax, (1.0 - sin(positionAlong * PI)));
              }

              // compute the anti-aliased stroke edge  
              float edge = 1.0 - antiAliasStep(computedThickness, d);
              // now compute the final color of the mesh
              vec4 outColor = vec4(0.0);
              if (seeThrough) {
                outColor = vec4(stroke, edge);
                if (insideAltColor && !gl_FrontFacing) {
                  outColor.rgb = fill;
                }
              } else {
                outColor.rgb = mix(background, stroke, edge);
                outColor.a = 1.0;
              }
              return outColor;
            }
          
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
              vec3 toonColor = color * lightColor * diffuse;

              if (vRotatedPosition.x <= splitPosition) {
                // solid
                gl_FragColor = vec4(toonColor, 1.0);
              } else {
                // wireframe
                gl_FragColor = getStyledWireframe(
                  vBarycentric, 
                  aboveSplitColor,
                  aboveSplitColor,
                  backgroundColor,
                  squeeze,
                  thickness
                );
              }
            }
          `}
        />
      </mesh>
      <mesh geometry={geometry} {...props}>
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
