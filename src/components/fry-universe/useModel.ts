import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import getStaticUrl from '../../utils/getStaticUrl';

const urls = {
  ridged: getStaticUrl('/static/models/potatoes/ridged.gltf'),
  waffle: getStaticUrl('/static/models/potatoes/waffle.gltf'),
  curly: getStaticUrl('/static/models/potatoes/curly.gltf'),
  fry: getStaticUrl('/static/models/potatoes/fry.gltf'),
  wedge: getStaticUrl('/static/models/potatoes/wedge.gltf'),
  potato: getStaticUrl('/static/models/potatoes/potato.gltf'),
};

export function useRidgedModel() {
  const result = (useGLTF(urls.ridged) as unknown) as {
    nodes: {
      ridged_export: THREE.Mesh;
    };
  };

  return result.nodes.ridged_export.geometry;
}

export function useWaffleModel() {
  const result = (useGLTF(urls.waffle) as unknown) as {
    nodes: {
      waffle_export: THREE.Mesh;
    };
  };

  return result.nodes.waffle_export.geometry;
}

export function useCurlyModel() {
  const result = (useGLTF(urls.curly) as unknown) as {
    nodes: {
      curly_fry_export: THREE.Mesh;
    };
  };

  return result.nodes.curly_fry_export.geometry;
}

export function useFryModel() {
  const result = (useGLTF(urls.fry) as unknown) as {
    nodes: {
      straightexport: THREE.Mesh;
    };
  };

  const geometry = useMemo(() => result.nodes.straightexport.geometry.translate(0, -0.5, 0), []);

  return geometry;
}

export function useTotModel() {
  const totGeometry = useMemo(
    () =>
      // while there is a model (used for measurements), might as well just use a cylinder...
      new THREE.CylinderBufferGeometry(1.5, 1.5, 3.5, 20, 1, false)
        .rotateX(0.025 * Math.PI)
        .rotateZ(0.1 * Math.PI)
        .translate(0, -0.5, 0),
    [],
  );

  return totGeometry;
}

export function useWedgeModel() {
  const result = (useGLTF(urls.wedge) as unknown) as {
    nodes: {
      wedge_export: THREE.Mesh;
    };
  };

  return result.nodes.wedge_export.geometry;
}

export function usePotatoModel() {
  const result = (useGLTF(urls.potato) as unknown) as {
    nodes: {
      potato001: THREE.Mesh;
    };
  };

  return result.nodes.potato001.geometry;
}

useGLTF.preload(urls.ridged);
useGLTF.preload(urls.waffle);
useGLTF.preload(urls.curly);
useGLTF.preload(urls.fry);
useGLTF.preload(urls.wedge);
useGLTF.preload(urls.potato);
