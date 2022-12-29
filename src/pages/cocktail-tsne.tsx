/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, MeshProps, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { pack } from 'd3-hierarchy';
import create from 'zustand';
import * as THREE from 'three';

import Page from '../components/Page';
import { background as backgroundColor, text as textColor } from '../components/cocktails/colors';
import getStaticUrl from '../utils/getStaticUrl';
import useData from '../hooks/useData';
import {
  rawDataToCocktailHierarchy,
  cocktailHierarchyToIngredientHierarchy,
  RawData,
  CocktailHierarchy,
  getCocktailPairwiseDistance,
} from '../components/cocktails/parsers/rawData';
import Text from '../components/fry-universe/Text';
import tsnejs from '../components/cocktails/parsers/tsne';
import { scaleLinear } from '@visx/scale';
import Cocktail from '../components/cocktails/Cocktail';

const parserFactory = (size: number) => {
  const parser = (rawData: RawData) => {
    const cocktailHierarchy = rawDataToCocktailHierarchy(rawData);

    const ingredientHierarchy = cocktailHierarchyToIngredientHierarchy(cocktailHierarchy.children);
    const cocktailPack = pack()
      .size([size, size])
      .padding(d => (d.height === 1 ? 1 : d.height === 2 ? 30 : 0))(cocktailHierarchy.copy());

    const cocktailLookup = cocktailPack.children.reduce((all, curr) => {
      all[curr.data.name] = curr;
      return all;
    }, {});
    const distance = getCocktailPairwiseDistance(cocktailHierarchy);
    // console.log(distance.array);

    const result = {
      cocktailPack,
      cocktailHierarchy,
      ingredientHierarchy,
      distanceLookup: distance.lookup,
      distanceArray: distance.array,
      cocktailLookup,
    };
    // console.log(result);
    return result;
  };
  return parser;
};

// app state
interface AppState {
  selectedCocktail: null | CocktailHierarchy;
  clearCocktail: () => void;
  setCocktail: (c: CocktailHierarchy | null) => void;
}

const useStore = create<AppState>(set => ({
  selectedCocktail: null,
  clearCocktail: () => set({ selectedCocktail: null }),
  setCocktail: selectedCocktail => set({ selectedCocktail }),
}));

function Scene() {
  const {
    size: { width, height },
  } = useThree();
  const parser = useMemo(() => parserFactory(Math.max(width, height)), [width, height]);

  const { data, loading, error } = useData({
    url: getStaticUrl('static/data/cocktails.json'),
    responseType: 'json',
    parser,
  });

  const { selectedCocktail } = useStore();

  return (
    <>
      <OrbitControls />
      <axisHelper />
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error</Text>}
      {data && <Cocktails {...data} />}
      {selectedCocktail && (
        <Cocktail
          cocktail={selectedCocktail.data.name}
          lookup={data.cocktailLookup}
          distances={data.distanceLookup}
        />
      )}
    </>
  );
}

type CocktailProps = ReturnType<ReturnType<typeof parserFactory>>;

function Cocktails({ cocktailHierarchy, distanceArray, cocktailLookup }: CocktailProps) {
  const meshRef = useRef<THREE.InstancedMesh>();
  const object3d = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color('black'), []);

  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(distanceArray.length).fill(null).flatMap((_, i) => color.set(color).toArray()),
      ),
    [],
  );

  const { setCocktail, selectedCocktail } = useStore();
  const tsneModel = useMemo(() => {
    const model = new tsnejs.tSNE({
      dim: 2,
      perplexity: 3,
    });

    model.initDataDist(distanceArray);
    // model.step();

    return model;
  }, [distanceArray]);

  const tsneSolution = useRef<[number, number][]>(tsneModel.getSolution());

  const costs = useRef({ cost: 100, cost0: 0 });

  const scales = useMemo(
    () => ({
      x: scaleLinear({}),
      y: scaleLinear({}),
    }),
    [],
  );

  useFrame(() => {
    const { cost, cost0 } = costs.current;

    // stop updating if stable
    if (Math.abs(cost - cost0) < 1e-6) return;
    costs.current.cost = cost0;
    costs.current.cost0 = cost * 0.9 + 0.1 * tsneModel.step();

    tsneSolution.current = tsneModel.getSolution();
    const points = tsneSolution.current;

    const xVals = points.map(d => d[0]);
    const yVals = points.map(d => d[1]);

    scales.x.domain([Math.min(...xVals), Math.max(...xVals)]).range([-0.5, 0.5]);
    scales.y.domain([Math.min(...yVals), Math.max(...yVals)]).range([-0.5, 0.5]);

    points.forEach((cocktail, i) => {
      const [x, y] = cocktail;

      // Update the dummy object
      object3d.position.set(scales.x(x) as number, scales.y(y) as number, 0);
      object3d.scale.set(1, 1, 1);
      object3d.updateMatrix();
      // meshRef.current.setColorAt(i, color);
      // meshRef.current.geometry.attributes.color.needsUpdate = true;

      // And apply the matrix to the instanced item
      meshRef.current.setMatrixAt(i, object3d.matrix);

      if (selectedCocktail === cocktailHierarchy.children[i]) {
        color.set('purple').toArray(colorArray, i * 3);
        // meshRef.current.setColorAt(i, new THREE.Color('purple'));
        meshRef.current.geometry.attributes.color.needsUpdate = true;
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, distanceArray.length]} // [geometry, material, count]
      onClick={e => {
        e.stopPropagation();
        console.log(
          e.instanceId,
          cocktailHierarchy.children[e.instanceId].data.name,
          cocktailHierarchy.children[e.instanceId].data.children.map(d => d.simple_ingredient),
        );

        setCocktail(cocktailHierarchy.children[e.instanceId]);
      }}
    >
      <sphereGeometry
        args={[0.008, 10, 10]} // [width, height]
      >
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
      </sphereGeometry>
      <meshPhongMaterial vertexColors={false} />
      {/* <meshStandardMaterial
        color="yellow"
        // side={THREE.DoubleSide} // solid on both sides
        depthWrite={false}
      /> */}
    </instancedMesh>
  );
}

export default function CocktailPage() {
  return (
    <>
      <Page
        title="Cocktails"
        description="Explore the world of cocktails."
        // previewImgUrl="https://raw.githubusercontent.com/williaster/moi/gh-pages/static/images/fry-universe/site-preview.png"
        previewImgDescription="Image of cocktails"
        centerContent={false}
        showNav={false}
      >
        <div className="canvas">
          <Canvas
            camera={{ zoom: 6 }}
            gl={{ antialias: true }}
            dpr={Math.max(typeof window === 'undefined' ? 2 : window.devicePixelRatio, 2)}
          >
            <React.Suspense fallback={null}>
              <Scene />
            </React.Suspense>
            {typeof window !== 'undefined' && window.location.search.includes('stats') && (
              <Stats className="stats" />
            )}
            <ambientLight intensity={0.5} />
            <pointLight intensity={0.5} />
          </Canvas>
        </div>
      </Page>
      <style global jsx>{`
        .main {
          height: 100%;
          width: 100%;
          background: ${textColor};
          color: ${backgroundColor};
          overflow: visible;
        }
        p {
          margin-top: 0.6em;
        }
        .page {
          padding: 0;
        }
        .canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          z-index: 10;
        }
        .stats {
          top: initial !important;
          left: initial !important;
          bottom: 0;
          right: 0;
        }
      `}</style>
    </>
  );
}
