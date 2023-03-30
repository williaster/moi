import React, { useMemo, useState } from 'react';
import { Canvas, MeshProps, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { pack } from 'd3-hierarchy';
import create from 'zustand';

import Page from '../components/Page';
import {
  backgroundColor,
  backgroundColorDark,
  ingredientColorScale,
  textColor,
  textColorDark,
  textColorDarker,
} from '../components/cocktails/colors';
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

const parserFactory = (size: number) => {
  const parser = (rawData: RawData) => {
    const cocktailHierarchy = rawDataToCocktailHierarchy(rawData);
    const cocktailLookup = cocktailHierarchy.children.reduce((all, curr) => {
      all[curr.data.name] = curr;
      return all;
    }, {});
    const ingredientHierarchy = cocktailHierarchyToIngredientHierarchy(cocktailHierarchy.children);
    const cocktailPack = pack()
      .size([size, size])
      .padding(d => (d.height === 1 ? 1 : d.height === 2 ? 30 : 0))(cocktailHierarchy.copy());

    const distance = getCocktailPairwiseDistance(cocktailHierarchy);

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
  return (
    <>
      <OrbitControls />
      {/* <axisHelper /> */}
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error</Text>}
      {data && <Cocktails {...data} />}
    </>
  );
}

type CocktailProps = ReturnType<ReturnType<typeof parserFactory>>;

function Cocktails({ cocktailPack, distanceLookup, cocktailLookup }: CocktailProps) {
  const {
    size: { width, height },
  } = useThree();
  const { selectedCocktail } = useStore();
  const size = Math.max(width, height);
  if (selectedCocktail) {
    // @TODO cocktail lookup
    const distances = distanceLookup[selectedCocktail.data.name];
    const closest10 = Object.entries(distances)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 15);

    const info = closest10.map(a => ({
      name: a[0],
      distance: a[1],
      ingredients: cocktailLookup[a[0]].data.children.map(i => i.simple_ingredient),
    }));

    console.log(
      `Close to a ${selectedCocktail.data.name}`,
      cocktailLookup[selectedCocktail.data.name].data.children.map(i => i.simple_ingredient),
      info,
    );
  }
  return (
    <group
      position={
        // center
        [-0.5, -0.5, 0]
      }
    >
      {selectedCocktail ? (
        <Cocktail
          position={[-0.25, 0.5, 0]}
          cocktail={selectedCocktail}
          r={(10 * selectedCocktail.r) / size}
        />
      ) : (
        cocktailPack.children.map((cocktail, i) => (
          <Cocktail
            key={cocktail.name ?? i}
            position={[cocktail.x / size, cocktail.y / size, 0]}
            cocktail={cocktail}
            r={cocktail.r / size}
          />
        ))
      )}
    </group>
  );
}

function Cocktail({
  cocktail,
  r,
  position,
  ...meshProps
}: MeshProps & { cocktail: CocktailHierarchy['children'][number]; r: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const ingredients = cocktail.children;
  const {
    size: { width, height },
  } = useThree();
  const size = Math.max(width, height);
  const { setCocktail, selectedCocktail } = useStore();
  const isSelected = selectedCocktail === cocktail;
  const multiplier = isSelected ? 10 : 1;
  return (
    <group position={position}>
      <mesh
        {...meshProps}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => setCocktail(isSelected ? null : cocktail)}
      >
        <sphereGeometry args={[r, 15, 30]} />
        <meshPhongMaterial
          color="#fff"
          // wireframe={!isHovered && !isSelected}
          transparent
          shininess={50}
          opacity={0.2}
        />
      </mesh>
      {(isHovered || isSelected) && (
        <Text position={[0, r, r]} scale={0.05}>
          {cocktail.data.name}
        </Text>
      )}
      {ingredients.map((ingredient, i) => (
        <Ingredient
          key={ingredient.name ?? i}
          ingredient={ingredient}
          r={multiplier * (ingredient.r / size)}
          position={[
            (multiplier * (ingredient.x - ingredient.parent.x)) / size,
            (multiplier * (ingredient.y - ingredient.parent.y)) / size,
            0,
          ]}
        />
      ))}
    </group>
  );
}

function Ingredient({
  ingredient,
  r,
  ...meshProps
}: MeshProps & {
  ingredient: CocktailHierarchy['children'][number]['children'][number];
  r: number;
}) {
  return (
    <mesh {...meshProps}>
      <sphereGeometry args={[r, 15, 20]} />
      <meshPhongMaterial
        color={ingredientColorScale(ingredient.data.simple_ingredient)}
        shininess={100}
      />
    </mesh>
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
            <ambientLight intensity={0.5} />
            <directionalLight intensity={0.5} />
            {typeof window !== 'undefined' && window.location.search.includes('stats') && (
              <Stats className="stats" />
            )}
          </Canvas>
        </div>
      </Page>
      <style global jsx>{`
        .main {
          height: 100%;
          width: 100%;
          background: #95a8c1;
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
