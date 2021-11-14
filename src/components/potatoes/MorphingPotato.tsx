import React, { forwardRef, useMemo, useRef, useEffect } from 'react';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import * as model from './useModel';
import * as colors from './colors';
import getKeyframes from './utils/getKeyframes';

const coordsPerVertex = 3;
const verticesPerFace = 3;
const normalsPerVertex = 3;
const coordsPerFace = coordsPerVertex * verticesPerFace;
const color = { value: new THREE.Color(colors.highlightColorLight) };
const lightDirection = { value: new THREE.Vector3(0.7, 1, 1).normalize() };
const lightColor = { value: new THREE.Color('white').setScalar(1) };

const MorphingPotatoPrivate = forwardRef(
  ({ opacityRef }: { opacityRef: React.MutableRefObject<{ value: number }> }, ref) => {
    const ridged = model.useRidgedModel();
    const waffle = model.useWaffleModel();
    const curly = model.useCurlyModel();
    const fry = model.useFryModel();
    const tot = model.useTotModel();
    const wedge = model.useWedgeModel();
    const potato = model.usePotatoModel();

    const rotationMatrix = useRef({ value: new THREE.Matrix4() });
    const opacity = useRef({ value: 0 });
    const morph = useRef({ value: 0 });
    const morphDelta = useRef(0.005);

    useEffect(() => {
      if (opacityRef) {
        opacityRef.current = opacity.current;
      }
    }, [opacityRef]);

    // can this be async?
    const morphGeo = useMemo(() => {
      const morphGeometry = new THREE.BufferGeometry();

      // to morph between geometries we nave to match faces which requires un-indexing
      const nonIndexed = [
        ridged.toNonIndexed().scale(1.5, 1.5, 1.5),
        waffle.toNonIndexed().scale(1.5, 1.5, 1.5),
        curly.toNonIndexed(),
        fry.toNonIndexed(),
        tot.toNonIndexed().scale(1.5, 1.5, 1.5),
        wedge.toNonIndexed(),
        potato.toNonIndexed(),
      ];

      const geoVertexCounts = nonIndexed.map(geo => geo.attributes.position.count);
      const maxVertexCount = Math.max(...geoVertexCounts);
      const morphPositions = nonIndexed.map(
        () => new Float32Array(maxVertexCount * verticesPerFace),
      );
      const morphNormals = nonIndexed.map(
        () => new Float32Array(maxVertexCount * normalsPerVertex),
      );

      // pull the position + normal from a geometry and add as custom attributes on
      // the single morphing geometry
      for (let morphIndex = 0; morphIndex < nonIndexed.length; morphIndex += 1) {
        const geo = nonIndexed[morphIndex];
        const morphPosition = morphPositions[morphIndex];
        const morphNormal = morphNormals[morphIndex];
        const geoVertexCount = geoVertexCounts[morphIndex];

        // different geometries have different vertex counts which can
        // make morphing faces appear to come from one part of the geometry
        // by padding the start and end, we can map to the middle of a geometry
        // (assigning randomly isn't consistent across geometries so doesn't look good)
        const extraVertices = maxVertexCount - geoVertexCount;
        const extraVerticesPerSide = Math.floor(extraVertices / 2);
        const indexPaddingSnapToFace =
          extraVerticesPerSide - (extraVerticesPerSide % coordsPerFace);

        for (
          let faceIdx = 0;
          faceIdx < geoVertexCount * verticesPerFace; // step through each face in _this_ geo
          faceIdx += coordsPerFace
        ) {
          // step through each coord in the face
          for (let coordIdx = 0; coordIdx < coordsPerFace; coordIdx += 1) {
            morphPosition[faceIdx + coordIdx + indexPaddingSnapToFace] =
              geo.attributes.position.array[faceIdx + coordIdx] || 0;

            morphNormal[faceIdx + coordIdx + indexPaddingSnapToFace] =
              geo.attributes.normal.array[faceIdx + coordIdx] || 0;
          }
        }

        morphGeometry.setAttribute(
          // need at least one attribute called 'position' else nothing is rendered
          morphIndex === 0 ? 'position' : `position_${morphIndex}`,
          new THREE.BufferAttribute(morphPosition, coordsPerVertex),
        );

        morphGeometry.setAttribute(
          `normal_${morphIndex}`,
          new THREE.BufferAttribute(morphNormal, normalsPerVertex),
        );

        geo.dispose();
      }

      return morphGeometry;
    }, []);

    useFrame(({ clock }) => {
      rotationMatrix.current.value.makeRotationY(Math.PI * clock.elapsedTime * 0.15);
      morph.current.value = Math.max(0, Math.min(1, morph.current.value + morphDelta.current));
      if (morph.current.value <= 0 || morph.current.value >= 1) morphDelta.current *= -1;
    });

    return (
      <mesh ref={ref} geometry={morphGeo}>
        <shaderMaterial
          key={Math.random()} // @todo remove, how to handle disposal?
          side={THREE.DoubleSide}
          uniforms={{
            morph: morph.current,
            rotationMatrix: rotationMatrix.current,
            color,
            opacity: opacity.current,
            // toon shading
            lightDirection,
            lightColor,
          }}
          vertexShader={`
            float morphSteps = 7.0;

            uniform float morph;
            uniform mat4 rotationMatrix;
            
            // attribute vec3 position;
            attribute vec3 position_1;
            attribute vec3 position_2;
            attribute vec3 position_3;
            attribute vec3 position_4;
            attribute vec3 position_5;
            attribute vec3 position_6;

            attribute vec3 normal_0;
            attribute vec3 normal_1;
            attribute vec3 normal_2;
            attribute vec3 normal_3;
            attribute vec3 normal_4;
            attribute vec3 normal_5;
            attribute vec3 normal_6;

            varying vec3 vNormal;

            float ease(float t) {
              return (t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * --t * t * t * t * t);
              // return t < 0.5 ? 4.0 * t * t * t : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0;
            }
          
            void main () {
              float currStepFloat = morph * (morphSteps - 1.0);
              float withinStep = mod(currStepFloat, 1.0);
              float currStepInt = floor(currStepFloat);
              
              vec3 positionStart;
              vec3 positionEnd;
              vec3 normalStart;
              vec3 normalEnd;

              // this is ugly, could a struct be used
              if (currStepInt < 1.0) {
                positionStart = position;
                normalStart = normal_0;

                positionEnd = position_1;
                normalEnd = normal_1;
              } else if (currStepInt < 2.0) {
                positionStart = position_1;
                normalStart = normal_1;

                positionEnd = position_2;
                normalEnd = normal_2;
              } else if (currStepInt < 3.0) {
                positionStart = position_2;
                normalStart = normal_2;

                positionEnd = position_3;
                normalEnd = normal_3;
              } else if (currStepInt < 4.0) {
                positionStart = position_3;
                normalStart = normal_3;

                positionEnd = position_4;
                normalEnd = normal_4;
              } else if (currStepInt < 5.0) {
                positionStart = position_4;
                normalStart = normal_4;

                positionEnd = position_5;
                normalEnd = normal_5;
              } else {
                positionStart = position_5;
                normalStart = normal_5;

                positionEnd = position_6;
                normalEnd = normal_6;

                if (currStepInt == 6.0) withinStep = 1.0; 
              }

              float easedMorph = ease(withinStep);
              vec3 morphedPosition = mix(positionStart, positionEnd, easedMorph);
              vec4 rotatedPosition = rotationMatrix * vec4(morphedPosition, 1.0);
              gl_Position = projectionMatrix * modelViewMatrix * rotatedPosition;

              // rotate the normal so the light appears is constant
              vec3 morphedNormal = mix(normalStart, normalEnd, easedMorph);
              vec4 rotatedNormal = rotationMatrix * vec4(morphedNormal, 1.0);
              vNormal = rotatedNormal.xyz;
            }
          `}
          fragmentShader={`
            float numGradientSteps = 3.0;
            
            uniform float morph;
            uniform vec3 color;
            uniform float opacity;
            uniform vec3 lightColor;
            uniform vec3 lightDirection;

            varying vec3 vNormal;
          
            void main() {
              if (opacity == 0.0) discard;

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

              vec3 toonColor = color * lightColor * diffuse;
              gl_FragColor = vec4(toonColor, 1.0);
            }
          `}
        />
      </mesh>
    );
  },
);

const keyframes = {
  scale: getKeyframes([0, 0, 0, 0, 0, 0, 0, 0.05], 'easeOutCubic'),
  opacity: getKeyframes([0, 0, 0, 0, 0, 0, 0, 1], 'easeOutCubic'),
};

function MorphingPotato() {
  const ref = useRef<THREE.Mesh>();
  const opacityRef = useRef<{ value: number }>();
  const scroll = useScroll();

  useFrame(({ viewport }) => {
    ref.current.scale.setScalar(
      keyframes.scale(scroll.offset) * Math.min(viewport.width, viewport.height),
    );
    ref.current.position.x = -0.25 * viewport.width;
    opacityRef.current.value = keyframes.opacity(scroll.offset);
  });

  return <MorphingPotatoPrivate ref={ref} opacityRef={opacityRef} />;
}

export default MorphingPotato;
