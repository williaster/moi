/* eslint-disable react/require-default-props */
/* eslint-disable no-undef */
import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

import Text from '../fry-universe/Text';
import getStaticUrl from '../../utils/getStaticUrl';
import useData from '../../hooks/useData';
import parserFactory from './parsers/parserFactory';
import { background, blue, ingredientColorScale, text } from './colors';
import { CocktailHierarchy, CocktailPack, IngredientChild, IngredientHierarchy } from './types';
import IngredientSelect from './IngredientSelect';
import useStore from './appStore';
import cleanRawData from './parsers/cleanRawData';
import getCocktailHierarchy from './parsers/getCocktailHierarchy';
import getCocktailEditDistance from './parsers/getCocktailEditDistance';
import getCocktailLookup from './parsers/getCocktailLookup';
import getCocktailPack from './parsers/getCocktailPack';
import getIngredients from './parsers/getIngredients';
import getIngredientHierarchy from './parsers/getIngredientHierarchy';
import getIngredientPack from './parsers/getIngredientPack';

export default function CocktailScene() {
  const {
    size: { width, height },
  } = useThree();

  const size = Math.min(width, height);
  const { selectedIngredients } = useStore();

  const { data, loading, error } = useData({
    url: getStaticUrl('static/data/cocktails.json'),
    responseType: 'json',
    parser: cleanRawData,
  });

  const hierarchy = useMemo(() => data && getCocktailHierarchy(data), [data]);
  const pack = useMemo(() => hierarchy && getCocktailPack(hierarchy, size, selectedIngredients), [
    hierarchy,
    size,
    selectedIngredients,
  ]);

  // @TODO filter by selected ingredients
  const ingredientHierarchy = useMemo(() => hierarchy && getIngredientHierarchy(hierarchy), [
    hierarchy,
  ]);

  const lookup = useMemo(() => hierarchy && getCocktailLookup(hierarchy), [hierarchy]);
  const distance = useMemo(() => hierarchy && getCocktailEditDistance(hierarchy), [hierarchy]);

  const ingredientPack = useMemo(
    () => ingredientHierarchy && getIngredientPack(ingredientHierarchy, size),
    [ingredientHierarchy, size],
  );

  const ingredients = useMemo(() => pack && getIngredients(pack), [pack]);

  const parsedData = data
    ? {
        hierarchy,
        lookup,
        distance,
        ingredients,
        pack,
      }
    : null;

  return (
    <>
      {/* <axisHelper /> */}
      {loading && (
        <Text scale={0.2} color={text}>
          Loading...
        </Text>
      )}
      {error && (
        <Text scale={0.2} color={text}>
          Error
        </Text>
      )}
      {data && (
        <Html
          calculatePosition={() => [0, 0, 0]}
          style={{
            transform: 'translate(16px, 16px)',
            background: `${background}cc`,
            border: `1px solid rgb(150, 200, 218)`,
            borderRadius: '4px',
            fontSize: '24px',
            padding: '16px 16px',
          }}
        >
          <h2 style={{ color: text, padding: 0, margin: 0, marginBottom: 4 }}>Cocktails</h2>
          <IngredientSelect ingredients={ingredients} />
        </Html>
      )}
      {/* {data && <Cocktails {...parsedData} />} */}
      {ingredientPack && <Ingredients ingredientPack={ingredientPack} />}
    </>
  );
}

type CocktailProps = {
  pack: ReturnType<typeof getCocktailPack>;
  ingredients: ReturnType<typeof getIngredients>;
  // hierarchy: ReturnType<typeof getCocktailHierarchy>;
  // lookup: ReturnType<typeof getCocktailLookup>;
  distance: ReturnType<typeof getCocktailEditDistance>;
};

function Ingredients({ ingredientPack }: { ingredientPack: ReturnType<typeof getIngredientPack> }) {
  const {
    size: { width, height },
  } = useThree();
  const size = Math.min(width, height);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      {ingredientPack.children.map(category => {
        const showCategoryLabel = true;

        return (
          <group
            key={category.data.name}
            position={[category.x / size - 1, category.y / size - 1, 0]}
          >
            <mesh>
              <sphereGeometry args={[category.r / size, 15, 20]} />
              <meshBasicMaterial color={'white'} transparent opacity={0.2} />
              {showCategoryLabel && (
                <Html
                  center
                  distanceFactor={10}
                  style={{
                    pointerEvents: 'none',
                    color: '#222',
                    fontWeight: 'bold',
                    transform: `translate(-${0.8 * category.r}px, -${0.8 * category.r}px)`,
                  }}
                >
                  {category.data.name}
                </Html>
              )}
            </mesh>

            {category.children.map(simple => {
              const simpleColor = ingredientColorScale(simple.data.name);
              const showSimpleLabel =
                !hovered || simple.children?.every(verb => verb.data.name !== hovered);
              return (
                <group
                  key={simple.data.name}
                  position={[
                    (simple.x - simple.parent.x) / size,
                    (simple.y - simple.parent.y) / size,
                    0,
                  ]}
                >
                  {/* <mesh>
                    <sphereGeometry args={[simple.r / size, 15, 20]} />
                    <meshBasicMaterial color={simpleColor} transparent opacity={0.4} />
                    
                  </mesh> */}
                  {showSimpleLabel && (
                    <Html
                      center
                      distanceFactor={5}
                      style={{ pointerEvents: 'none', color: '#222' }}
                    >
                      {simple.data.name}
                    </Html>
                  )}

                  {simple.children.map(verbose => {
                    const showVerboseLabel = hovered === verbose.data.name;
                    return (
                      <group
                        key={verbose.data.name}
                        position={[
                          (verbose.x - verbose.parent.x) / size,
                          (verbose.y - verbose.parent.y) / size,
                          0,
                        ]}
                      >
                        <mesh
                          onPointerOver={e => {
                            e.stopPropagation(); // don't trigger hover on other cocktails
                            setHovered(verbose.data.name);
                          }}
                          onPointerOut={() => setHovered(null)}
                        >
                          <sphereGeometry args={[verbose.r / size, 15, 20]} />
                          <meshPhongMaterial color={simpleColor} shininess={50} />
                          {showVerboseLabel && (
                            <Html
                              center
                              distanceFactor={5}
                              style={{ pointerEvents: 'none', color: '#222', whiteSpace: 'nowrap' }}
                            >
                              {verbose.data.name}
                            </Html>
                          )}
                        </mesh>
                      </group>
                    );
                  })}
                </group>
              );
            })}
          </group>
        );
      })}
    </>
  );
}

function Cocktails({ pack, ingredients, distance }: CocktailProps) {
  const {
    size: { width, height },
  } = useThree();
  const size = Math.min(width, height);

  return (
    <>
      {pack.children.map(cocktail => (
        <Cocktail
          key={cocktail.data.name}
          position={[cocktail.x / size - 0.5, cocktail.y / size - 0.5, 0]}
          cocktail={cocktail}
          distances={distance[cocktail.data.name]}
          r={cocktail.r / size}
        />
      ))}
    </>
  );
}

const hoverScale = 5;

function Cocktail({
  cocktail,
  r,
  distances,
  position: nextPosition,
  ...meshProps
}: {
  cocktail: CocktailHierarchy;
  r: number;
  distances: { [key: string]: number };
  position: [number, number, number];
}) {
  const {
    size: { width, height },
  } = useThree();
  const groupRef = useRef<THREE.Group>();
  const [isHovered, setIsHovered] = useState(false);
  const multiplier = 1;
  const size = Math.min(width, height);
  const nextPosVec3 = useMemo(
    () =>
      new THREE.Vector3(
        nextPosition[0],
        nextPosition[1],
        nextPosition[2] + (isHovered ? 1.5 * r : 0),
      ),
    [nextPosition, isHovered, r],
  );
  const nextScale = useMemo(
    () =>
      new THREE.Vector3(
        isHovered ? hoverScale : 1,
        isHovered ? hoverScale : 1,
        isHovered ? hoverScale : 1,
      ),
    [isHovered],
  );
  useFrame(() => {
    if (groupRef?.current) {
      // update position + scale
      const currPosition = groupRef.current.position;
      currPosition.lerp(nextPosVec3, 0.1);

      const currScale = groupRef.current.scale;
      currScale.lerp(nextScale, 0.2);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        {...meshProps}
        onPointerOver={e => {
          e.stopPropagation(); // don't trigger hover on other cocktails
          setIsHovered(true);
        }}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => {
          const relatedCocktails = Object.entries(distances)
            .filter(([c, dist]) => c !== cocktail.data.name && dist <= 2)
            .sort((a, b) => a[1] - b[1]);

          console.log(cocktail);
          console.log('close cocktails', relatedCocktails);
        }}
      >
        <sphereGeometry args={[r * multiplier, 15, 30]} />
        <meshBasicMaterial color="#fff" transparent opacity={isHovered ? 0.5 : 0.2} />

        {isHovered && (
          <Html
            distanceFactor={10}
            style={{
              pointerEvents: 'none',
              transform: `translate(-50%, -${hoverScale * r * size}px)`, // @TODO not perfect but r not good
              whiteSpace: 'nowrap',
            }}
          >
            {cocktail.data.name}
          </Html>
        )}
      </mesh>

      {cocktail.children.map(ingredient => (
        <Ingredient
          key={ingredient.data.verbose_ingredient}
          ingredient={ingredient}
          r={(multiplier * ingredient.r) / size}
          position={[
            (multiplier * (ingredient.x - ingredient.parent.x)) / size,
            (multiplier * (ingredient.y - ingredient.parent.y)) / size,
            0,
          ]}
          showLabel={isHovered}
        />
      ))}
    </group>
  );
}

function Ingredient({
  ingredient,
  r,
  showLabel,
  ...meshProps
}: {
  ingredient: IngredientHierarchy;
  r: number;
  showLabel?: boolean;
}) {
  const color = ingredientColorScale(ingredient.data.simple_ingredient);
  return (
    <mesh {...meshProps}>
      <sphereGeometry args={[r, 15, 20]} />
      <meshPhongMaterial color={color} shininess={100} />
      {showLabel && (
        <Html center distanceFactor={5} style={{ pointerEvents: 'none', color: '#222' }}>
          {ingredient.data.simple_ingredient}
        </Html>
      )}
    </mesh>
  );
}
