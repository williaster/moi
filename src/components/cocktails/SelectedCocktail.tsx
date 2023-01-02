/* eslint-disable react/require-default-props */
import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

import useStore from './appStore';
import getCocktailEditDistance from './parsers/getCocktailEditDistance';
import getCocktailLookup from './parsers/getCocktailLookup';
import { CocktailHierarchy, IngredientHierarchy } from './types';
import { categoryColorScale, ingredientColorScale } from './colors';

interface SelectedCocktailProps {
  lookup: ReturnType<typeof getCocktailLookup>;
  distance: ReturnType<typeof getCocktailEditDistance>;
}

export default function SelectedCocktail({ lookup, distance }: SelectedCocktailProps) {
  const { selectedCocktail } = useStore();
  const {
    size: { height },
  } = useThree();

  const nearest = useMemo(() => {
    const cocktailDistances = distance[selectedCocktail.data.name];
    const top20 = Object.entries(cocktailDistances)
      .sort((a, b) => a[1] - b[1])

      //
      .filter(
        ([name, distance], i) =>
          name !== selectedCocktail.data.name &&
          // min of distance 2 or at least 20 results
          (distance < 3 || i <= 21),
      ) as [string, number][];

    const topByDistance = top20.reduce<{
      [distance: number]: { [name: string]: CocktailHierarchy };
    }>((all, curr) => {
      const [name, dist] = curr;
      all[dist] = all[dist] || {};
      all[dist][name] = lookup[name];
      if (!lookup[name]) console.error(`Missing cocktail ${name}`);
      return all;
    }, {});

    return topByDistance;
  }, [selectedCocktail, lookup, distance]);

  console.log(nearest);

  const distanceRingRadius = height * 0.25;
  const distanceRingLength = Math.PI * distanceRingRadius;
  const maxCocktailsInRing = Object.entries(nearest).reduce(
    (max, curr) => Math.max(max, Object.keys(curr).length),
    0,
  );
  const cocktailSize = (5 * distanceRingLength) / maxCocktailsInRing;
  const ringCount = Object.keys(nearest).length;

  return (
    <>
      <group position={[-0.25, 0.1, 0]}>
        <Cocktail
          cocktail={selectedCocktail}
          layout={{ x: 0, y: 0 }}
          ingredients
          radiusMultiple={5}
          events={false}
        />
      </group>

      {Object.entries(nearest).map(([distance, cocktails], i) => {
        const thetaStep = Math.PI / Object.keys(cocktails).length;
        return (
          <group key={i} position={[0.2 * i, 0.05, 0]}>
            {Object.entries(cocktails).map(
              ([name, cocktail], j) =>
                cocktail && (
                  <group
                    key={name}
                    position={[
                      (distanceRingRadius / height) *
                        ((i + 1) / ringCount) *
                        Math.cos(-Math.PI * 0.5 + thetaStep * (j + 0.5)),
                      -(distanceRingRadius / height) *
                        ((i + 1) / ringCount) *
                        Math.sin(-Math.PI * 0.5 + thetaStep * (j + 0.5)),
                      0,
                    ]}
                  >
                    <Cocktail
                      cocktail={cocktail}
                      layout={{ x: 0, y: 0 }}
                      ingredients
                      radiusMultiple={cocktailSize / height}
                      events
                      showName
                    />
                  </group>
                ),
            )}
          </group>
        );
      })}
    </>
  );
}

interface CocktailProps {
  cocktail: CocktailHierarchy;
  layout: { x: number; y: number };
  color?: string;
  ingredients?: boolean;
  radiusMultiple: number;
  events?: boolean;
  showName?: boolean;
}

const HOVER_SCALE = 5;

function Cocktail({
  cocktail,
  layout,
  ingredients,
  radiusMultiple,
  events,
  showName,
}: CocktailProps) {
  const {
    size: { width, height },
  } = useThree();
  const color = '#fff';
  const groupRef = useRef<THREE.Group>();
  const [isHovered, setIsHovered] = useState(false);
  const { setCocktail } = useStore();

  const multiplier = radiusMultiple;
  const size = Math.min(width, height);
  const r = cocktail.r / size;
  const positionVec3 = useMemo(() => new THREE.Vector3(), []);
  const nextScale = useMemo(
    () =>
      new THREE.Vector3(
        isHovered ? HOVER_SCALE : 1,
        isHovered ? HOVER_SCALE : 1,
        isHovered ? HOVER_SCALE : 1,
      ),
    [isHovered],
  );

  useFrame(() => {
    // update position + scale
    if (groupRef?.current) {
      const currPosition = groupRef.current.position;
      if (
        Math.abs(currPosition.x - layout.x) > 0.01 ||
        Math.abs(currPosition.y - layout.y) > 0.01
      ) {
        positionVec3.setZ(0);
        positionVec3.setX(layout.x / size);
        positionVec3.setY(layout.y / size);
        currPosition.lerp(positionVec3, 0.1);
      }

      const currScale = groupRef.current.scale;
      if (Math.abs(currScale.x - nextScale.x) > 0.01) {
        currScale.lerp(nextScale, 0.2);
        positionVec3.setZ(2 * r);
        currPosition.lerp(positionVec3, 0.1);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={
          events &&
          (e => {
            e.stopPropagation(); // don't trigger hover on other cocktails
            setIsHovered(true);
          })
        }
        onPointerOut={
          events &&
          (e => {
            e.stopPropagation(); // don't trigger hover on other cocktails
            setIsHovered(false);
          })
        }
        onClick={() => {
          setCocktail(cocktail);
        }}
      >
        <sphereGeometry args={[r * multiplier, 8, isHovered ? 30 : 10]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isHovered ? 0.7 : 0.5}
          side={THREE.BackSide}
        />
        {showName && (
          <Html
            center
            distanceFactor={5}
            style={{
              pointerEvents: 'none',
              transform: `translate(${r * size * multiplier * 2.5}px, -50%)`,
              whiteSpace: 'nowrap',
              color: '#222',
              background: 'rgba(255,255,255,0.5)',
            }}
          >
            {cocktail.data.name}
          </Html>
        )}

        {(!events || isHovered) && (
          <Html
            center
            distanceFactor={10}
            style={{
              pointerEvents: 'none',
              transform: `translate(-50%, ${r * size * multiplier * 1.1}px)`,
              whiteSpace: 'nowrap',
              color: '#222',
              background: 'rgba(255,255,255,0.5)',
            }}
          >
            {cocktail.data.name}

            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: 8,
              }}
            >
              {cocktail.data.children.map(ingredient => (
                <React.Fragment key={ingredient.verbose_ingredient}>
                  <div
                    style={{ color: categoryColorScale(ingredient.category), textAlign: 'right' }}
                  >
                    {ingredient.quantity}oz
                  </div>
                  <div style={{ color: categoryColorScale(ingredient.category) }}>
                    {ingredient.ingredient}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Html>
        )}
      </mesh>

      {ingredients &&
        cocktail.children.map(ingredient => (
          <Ingredient
            key={ingredient.data.verbose_ingredient}
            ingredient={ingredient}
            r={(multiplier * ingredient.r) / size}
            position={[
              (multiplier * (ingredient.x - ingredient.parent.x)) / size,
              (multiplier * (ingredient.y - ingredient.parent.y)) / size,
              0,
            ]}
            showLabel={!events || isHovered}
            color={
              false
                ? ingredientColorScale(ingredient.data.simple_ingredient)
                : categoryColorScale(ingredient.data.category)
            }
          />
        ))}
    </group>
  );
}

function Ingredient({
  ingredient,
  r,
  showLabel,
  color,
  ...meshProps
}: {
  ingredient: IngredientHierarchy;
  r: number;
  showLabel?: boolean;
  color?: string;
}) {
  return (
    <mesh {...meshProps}>
      <sphereGeometry args={[r, 10, 20]} />
      <meshPhongMaterial shininess={20} color={color} />

      {showLabel && (
        <Html
          center
          distanceFactor={5}
          style={{
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            color: '#222',
            background: 'rgba(255,255,255,0.5)',
          }}
        >
          {ingredient.data.simple_ingredient}
        </Html>
      )}
    </mesh>
  );
}
