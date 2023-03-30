/* eslint-disable no-undef */
import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

import { ingredientColorScale } from './colors';
import { CocktailHierarchy, IngredientHierarchy } from './types';

import getCocktailEditDistance from './parsers/getCocktailEditDistance';
import getCocktailPack from './parsers/getCocktailPack';

type CocktailProps = {
  pack: ReturnType<typeof getCocktailPack>;
  // ingredients: ReturnType<typeof getIngredients>;
  // hierarchy: ReturnType<typeof getCocktailHierarchy>;
  // lookup: ReturnType<typeof getCocktailLookup>;
  distance: ReturnType<typeof getCocktailEditDistance>;
};

export default function CocktailPack({ pack, distance }: CocktailProps) {
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
