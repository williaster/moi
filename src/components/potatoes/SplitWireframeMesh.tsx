import { useThree, useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, forwardRef } from 'react';
import * as THREE from 'three';

import addBarycentricCoordinates from './utils/addBarycentricCoords';

const vertexShader = `
  // these should both be added by 
  attribute vec3 barycentric;
  attribute float even;

  varying vec3 vBarycentric;
  varying vec3 vPosition;
  varying vec4 vRotatedPosition;
  varying float vEven;
  varying vec2 vUv;
  varying vec3 vNormal;

  uniform mat4 rotationMatrix;
  uniform float splitPosition;

  void main () {
    vRotatedPosition = rotationMatrix * vec4(position.xyz, 1.0);

    // if (vRotatedPosition.x >= splitPosition) {
    //   mat4 sPos = mat4(
    //     vec4(0.9, 0.0, 0.0, 0.0), // scale x
    //     vec4(0.0, 0.9, 0.0, 0.0), // scale y
    //     vec4(0.0, 0.0, 0.9, 0.0), // scale z
    //     vec4(0.0, 0.0, 0.0, 1.0)
    //   );
    //   vRotatedPosition = sPos * vRotatedPosition;
    // }

    // @TODO try to scale the split side?
    // "mat4 sPos = mat4(vec4(scaleX,0.0,0.0,0.0),",
    // "vec4(0.0,scaleY,0.0,0.0),",
    // "vec4(0.0,0.0,scaleZ,0.0),",
    // "vec4(0.0,0.0,0.0,1.0));",
    // vPosition =  tPos * rXPos * rZPos * rYPos * sPos;
    // gl_Position = projectionMatrix * modelViewMatrix * vPosition * vec4(position,1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vRotatedPosition;
    vBarycentric = barycentric;
    vEven = even;
    vUv = uv;
    vNormal = normal;
  }
`;
const fragmentShader = `
  varying vec3 vBarycentric;
  varying float vEven;
  varying vec2 vUv;
  varying vec4 vRotatedPosition;
  varying vec4 vProjectedPosition;
  varying vec3 vNormal;

  uniform bool seeThrough;
  uniform bool insideAltColor;
  uniform bool noiseA;
  uniform bool noiseB;
  uniform bool squeeze;

  uniform vec3 stroke;
  uniform vec3 fill;
  uniform vec3 background;

  uniform float time;
  uniform float thickness;
  uniform float squeezeMin;
  uniform float squeezeMax;
  uniform float splitPosition;

  float PI = 3.14159265359;

  float antiAliasStep (float threshold, float dist) {
    float afwidth = fwidth(dist) * 0.5;
    return smoothstep(threshold - afwidth, threshold + afwidth, dist);
  }

  // This function returns the fragment color for our styled wireframe effect
  // based on the barycentric coordinates for this fragment
  vec4 getStyledWireframe (vec3 barycentric, vec3 fill, vec3 stroke, vec3 background, bool squeeze, float thickness) {
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

  void main () {
    float gapLower = splitPosition -0.08;
    float gapUpper = splitPosition +0.08;
    if (vRotatedPosition.x >= gapLower && vRotatedPosition.x <= gapUpper) {
      // leave gap
      gl_FragColor = vec4(fill, 0.0);
    } else if (vRotatedPosition.x >= splitPosition) {
      // solid with simple "shadow" based on normal
      
      gl_FragColor = vec4(mix(fill, background * 0.8, -vNormal.y * 1.5), 1.0);
    } else {
      // wireframe
      // gl_FragColor = getStyledWireframe(vBarycentric, fill, stroke, background, squeeze, thickness);
      vec3 color = mix(stroke, stroke * 0.8, -vNormal.y * 1.5);
      gl_FragColor = getStyledWireframe(
        vBarycentric, 
        stroke,
        background,
        color,
        false,
        0.005
      );
    }
}    
`;

// needed for anti-alias smoothstep in aastep()
const shaderExtensions = { derivatives: true };

export interface SplitWireframeProps {
  stroke: string;
  fill: string;
  background: string;
  geometry: THREE.BufferGeometry;
  fillType?: 'split' | 'filled' | 'wireframe'; // @TODO expose splitPosition ref
  materialRef?: React.RefObject<THREE.Material>;
}

function SplitWireframeMesh(
  {
    stroke,
    fill,
    background,
    geometry: initGeometry,
    fillType = 'split',
    materialRef,
  }: SplitWireframeProps,
  ref: React.ForwardedRef<THREE.Mesh>,
) {
  const geometry = useMemo(() => {
    // custom wireframe shader relies on barycentric coords which requires un-indexing
    const geo = initGeometry.toNonIndexed();
    addBarycentricCoordinates(geo);
    return geo;
  }, [initGeometry]);

  const clock = useThree(state => state.clock);
  const rotationMatrix = useRef({ value: new THREE.Matrix4() });
  const splitPosition = useRef({
    value: fillType === 'split' ? 0.05 : fillType === 'filled' ? -3.5 : 3.5,
  });
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
        extensions={shaderExtensions}
        uniforms={{
          rotationMatrix: rotationMatrix.current,
          background: { value: new THREE.Color(background) },
          fill: { value: new THREE.Color(fill) },
          stroke: { value: new THREE.Color(stroke) },
          splitPosition: splitPosition.current,
          // @TODO remove unused uniforms (below)
          noiseA: { value: false },
          noiseB: { value: false },
          seeThrough: { value: false },
          insideAltColor: { value: false },
          thickness: { value: 0.025 },
          squeeze: { value: true },
          squeezeMin: { value: 0.4 },
          squeezeMax: { value: 3.0 },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default forwardRef(SplitWireframeMesh);
