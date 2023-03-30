/* eslint-disable react/require-default-props */
import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

import useStore from './appStore';
import getCocktailEditDistance from './parsers/getCocktailEditDistance';
import getCocktailLookup from './parsers/getCocktailLookup';
import { CocktailHierarchy, IngredientHierarchy } from './types';
import { categoryColorScale, ingredientColorScale } from './colors';
import HalfCircle from './HalfCircle';

interface SelectedCocktailProps {
  lookup: ReturnType<typeof getCocktailLookup>;
  distance: ReturnType<typeof getCocktailEditDistance>;
}

export default function SelectedCocktail({ lookup, distance }: SelectedCocktailProps) {
  const { selectedCocktail } = useStore();
  const {
    size: { height, width },
  } = useThree();
  const size = Math.min(width, height);

  const nearest = useMemo(() => {
    const cocktailDistances = distance[selectedCocktail.data.name];
    const top20 = Object.entries(cocktailDistances)
      .sort((a, b) => a[1] - b[1])
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

  const distanceRingRadius = 0.35; // @TODo should account for available height
  const ringCount = Object.keys(nearest).length;

  return (
    <>
      <group position={[-0.25, 0.1, 0]}>
        <Cocktail
          cocktail={selectedCocktail}
          showIngredients
          showIngredientQuantities
          radiusMultiple={5}
          events={false}
        />
      </group>

      {Object.entries(nearest).map(([distance, cocktails], i) => {
        const cocktailCount = Object.keys(cocktails).length;
        const thetaStep = Math.PI / cocktailCount;
        // increase ring size as distance grows (generally will have more cocktails further out)
        const ringRadius = distanceRingRadius * ((i + 1) / ringCount);
        const ringLength = Math.PI * ringRadius; // half a circle
        const cocktailSize = Math.min(0.1, 0.9 * (ringLength / cocktailCount));

        return (
          <group key={i} position={[0.1 * i, 0.05, 0]}>
            <HalfCircle radius={ringRadius} />

            <mesh position={[0, ringRadius, 0]}>
              <circleGeometry args={[0.1, 0]} />
              <meshBasicMaterial transparent opacity={0} />
              <Html
                style={{
                  pointerEvents: 'none',
                  fontSize: 20,
                  whiteSpace: 'nowrap',
                  color: '#222',
                  transform: `translate(-110%, -50%)`,
                }}
              >
                {i === 0 ? 'Same ingredients' : `±${i} ingredients`}
              </Html>
            </mesh>
            {Object.entries(cocktails).map(([name, cocktail], j) => {
              // @TODO build out from center not around the ring
              const theta = -Math.PI * 0.5 + thetaStep * (j + 0.5);
              const radiusMultiple = 30 * cocktailSize;

              return (
                // @TODO determine if we want filters to apply here
                cocktail && (
                  <group
                    key={name}
                    position={[ringRadius * Math.cos(theta), -ringRadius * Math.sin(theta), 0]}
                  >
                    <Cocktail
                      cocktail={cocktail}
                      showIngredients
                      radiusMultiple={radiusMultiple}
                      events
                      showName
                      label={{
                        x: `${50 * Math.cos(theta)}px`,
                        y: `${-10 + 50 * Math.sin(theta)}px`,
                      }}
                    />
                  </group>
                )
              );
            })}
          </group>
        );
      })}
    </>
  );
}

interface CocktailProps {
  cocktail: CocktailHierarchy;
  layout?: { x: number; y: number };
  label?: { x: string; y: string };
  color?: string;
  showIngredients?: boolean;
  radiusMultiple: number;
  events?: boolean;
  showName?: boolean;
  showIngredientQuantities?: boolean;
}

const HOVER_SCALE = 5;

function Cocktail({
  cocktail,
  layout = { x: 0, y: 0 },
  showIngredients,
  radiusMultiple,
  events,
  showName,
  label,
  showIngredientQuantities,
}: CocktailProps) {
  const {
    size: { width, height },
  } = useThree();
  const color = '#fff';
  const groupRef = useRef<THREE.Group>();
  const [isHovered, setIsHovered] = useState(false);
  const { setCocktail } = useStore();

  // have to use a multiplier to scale the cocktail and ingredients the same amount
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
      const currScale = groupRef.current.scale;

      positionVec3.setZ((isHovered ? 5 : 1) * multiplier * r);

      if (Math.abs(currScale.x - nextScale.x) > 0.01) {
        currScale.lerp(nextScale, 0.2);
        currPosition.lerp(positionVec3, 0.1);
      }

      if (Math.abs(currPosition.z - positionVec3.z) > 0.01) {
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
          opacity={isHovered ? 0.7 : 1}
          side={THREE.BackSide}
        />
        {showName && (
          <Html
            distanceFactor={5}
            style={{
              zIndex: -1,
              pointerEvents: 'none',
              transform: label
                ? `translate(${label.x}, ${label.y})`
                : `translate(${r * size * multiplier * 2.5}px, -50%)`,
              whiteSpace: 'nowrap',
              color: '#222',
              background: 'rgba(255,255,255,0.5)',
              fontSize: 24,
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
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            {!showName && cocktail.data.name}

            {showIngredientQuantities && (
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
                      {ingredient.verbose_ingredient}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </Html>
        )}
      </mesh>

      {showIngredients &&
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
            color={categoryColorScale(ingredient.data.category)}
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
            background: 'rgba(255,255,255,0.9)',
          }}
        >
          {ingredient.data.simple_ingredient}
        </Html>
      )}
    </mesh>
  );
}
