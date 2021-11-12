import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import * as model from './useModel';

const coordsPerVertex = 3;
const verticesPerFace = 3;
const coordsPerFace = coordsPerVertex * verticesPerFace;

function MorphingPotato() {
  const ridged = model.useRidgedModel();
  const waffle = model.useWaffleModel();
  const curly = model.useCurlyModel();
  const fry = model.useFryModel();
  const wedge = model.useWedgeModel();
  const potato = model.usePotatoModel();

  // can this be async?
  const morphGeo = useMemo(() => {
    console.time('morph geo');

    const morphGeometry = new THREE.BufferGeometry();

    const nonIndexed = [
      ridged.toNonIndexed(),
      waffle.toNonIndexed(),
      curly.toNonIndexed(),
      fry.toNonIndexed(),
      wedge.toNonIndexed(),
      potato.toNonIndexed(),
    ];

    const maxVertexCount = Math.max(...nonIndexed.map(geo => geo.attributes.position.count));
    const morphTargets = nonIndexed.map(() => new Float32Array(maxVertexCount * verticesPerFace));

    for (let geoIdx = 0; geoIdx < nonIndexed.length; geoIdx += 1) {
      // morph target of a given geo
      const geo = nonIndexed[geoIdx];
      const morphTarget = morphTargets[geoIdx];

      for (let faceIdx = 0; faceIdx < maxVertexCount * verticesPerFace; faceIdx += coordsPerFace) {
        for (let coordIdx = 0; coordIdx < coordsPerFace; coordIdx += 1) {
          morphTarget[faceIdx + coordIdx] = geo.attributes.position.array[faceIdx + coordIdx] || 0;
        }
      }

      morphGeometry.setAttribute(
        `morph_${geoIdx}`,
        new THREE.BufferAttribute(morphTarget, coordsPerVertex),
      );

      geo.dispose();
    }

    console.timeEnd('morph geo');

    return morphGeometry;
  }, []);
}

export default MorphingPotato;
