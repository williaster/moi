/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import getCocktailPack from './parsers/getCocktailPack';
import getCocktailLookup from './parsers/getCocktailLookup';
import useAxisLayout from './hooks/useAxisLayout';
import BalanceAxes from './BalanceAxes';
import { categoryColorScale, categoryColorScaleDark, ingredientColorScale } from './colors';
import Text from '../fry-universe/Text';
import useStore from './appStore';
import getCocktailEditDistance from './parsers/getCocktailEditDistance';
import getRelatedCocktails from './parsers/getRelatedCocktails';
import HalfCircle from './HalfCircle';
import { Html } from '@react-three/drei';

interface CocktailLayoutProps {
  pack: ReturnType<typeof getCocktailPack>;
  lookup: ReturnType<typeof getCocktailLookup>;
  relatedCocktails: ReturnType<typeof getRelatedCocktails>;
}

const getPositionFromMatrix = (matrix: number[], offset: number) => [
  matrix[offset + 12],
  matrix[offset + 13],
  matrix[offset + 14],
];

const getScaleFromMatrix = (matrix: number[], offset: number) => [
  matrix[offset + 0],
  matrix[offset + 5],
  matrix[offset + 10],
];

const INGREDIENT_LABEL_SCALE = 0.15;
const DISTANCE_RING_RADIUS = 0.35;

export default function CocktailLayout({ pack, lookup, relatedCocktails }: CocktailLayoutProps) {
  // constants
  const {
    size: { width, height },
  } = useThree();
  const size = Math.min(width, height);
  const relatedCocktailRingCount = Object.keys(relatedCocktails).length;

  // helper objects
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempPosition = useMemo(() => new THREE.Vector3(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // refs
  const cocktailMeshRef = useRef<THREE.Mesh>();
  const ingredientMeshRef = useRef<THREE.Mesh>();
  const hoveredCocktailTextRef = useRef<THREE.Group>();
  const relatedCocktailsTextRef = useRef<THREE.Group>();

  // state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { setCocktail, selectedCocktail } = useStore();
  useEffect(() => setHoveredIndex(null), [selectedCocktail]);

  // layout
  const layout = useAxisLayout({
    pack,
    lookup,
    relatedCocktails,
    ringRadius: DISTANCE_RING_RADIUS,
  });

  // counts
  const cocktailCount = layout.nodes().length;
  const ingredientCount = useMemo(
    () =>
      layout.nodes().reduce((sum, node) => sum + (lookup[node.cocktail]?.children?.length ?? 0), 0),
    [layout, lookup],
  );

  // colors arrays (these are used for color in instance meshes)
  const cocktailColors = useMemo(
    () =>
      Float32Array.from(
        layout.nodes().flatMap(node => {
          const cocktailColor = tempColor
            .set(node.color)
            .offsetHSL(0, 0, -0.1)
            .toArray();
          return cocktailColor;
        }),
      ),
    [layout, tempColor],
  );
  const ingredientColors = useMemo(
    () =>
      Float32Array.from(
        layout.nodes().flatMap(node => {
          const cocktail = lookup[node.cocktail];
          if (!cocktail) return [0, 0, 0];
          return (
            cocktail?.children.flatMap(ingredient => {
              const ingredientColor = tempColor
                .set(categoryColorScale(ingredient.data.category))
                .offsetHSL(0, 0, -0.2)
                .toArray();
              return ingredientColor;
            }) ?? []
          );
        }),
      ),
    [layout, lookup, tempColor],
  );

  // imperative updates per frame
  useFrame(() => {
    let currIngredientIndex = 0;

    layout.nodes().forEach((node, i) => {
      if (!cocktailMeshRef.current) return;

      const isHovered = i === hoveredIndex;
      const scaleMultiplier = isHovered ? 5 : 1;
      const cocktail = lookup[node.cocktail];
      const isHidden = cocktail?.data.hidden;

      // shouldn't happen
      if (!cocktail) {
        console.log(`Missing cocktail ${node.cocktail}`);
        return;
      }

      // transition cocktail from their current position/scale to the target
      const itemSize = 16; // size of transform matrix
      tempObject.position.set(
        ...getPositionFromMatrix(cocktailMeshRef.current.instanceMatrix.array, i * itemSize),
      );
      tempObject.scale.set(
        ...getScaleFromMatrix(cocktailMeshRef.current.instanceMatrix.array, i * itemSize),
      );

      // computed cocktail coords based on the latest layout
      const scale = isHidden ? 0 : (scaleMultiplier * node.r) / size;
      const x = node.x / size;
      const y = node.y / size;
      const z = isHovered ? scale : 0;

      tempPosition.set(x, y, z);
      tempScale.set(scale, scale, scale);

      tempObject.position.lerp(tempPosition, 0.1);
      tempObject.scale.lerp(tempScale, 0.1);
      tempObject.updateMatrix();

      cocktailMeshRef.current.setMatrixAt(i, tempObject.matrix);

      if (isHovered && hoveredCocktailTextRef.current) {
        hoveredCocktailTextRef.current.position.set(x, y + scale * 1.1, scale * 2);
        hoveredCocktailTextRef.current.scale.set(scale, scale, scale);
      }

      // update ingredient circles
      if (cocktail.children.length === 0) {
        console.log(`Missing cocktail ingredients for ${node.cocktail}`);
      }

      const cocktailScale = node.r / cocktail.r;
      const ingredientScaleMultiplier = cocktailScale * scaleMultiplier;
      cocktail.children.forEach(ingredient => {
        if (!ingredientMeshRef.current) return;

        const ingredientScale = isHidden ? 0 : (ingredientScaleMultiplier * ingredient.r) / size;
        const ingredientX =
          x + (ingredient.x - ingredient.parent.x) / (size / ingredientScaleMultiplier);
        const ingredientY =
          y + (ingredient.y - ingredient.parent.y) / (size / ingredientScaleMultiplier);
        const ingredientZ = z;

        tempObject.position.set(
          ...getPositionFromMatrix(
            ingredientMeshRef.current.instanceMatrix.array,
            currIngredientIndex * itemSize,
          ),
        );
        tempObject.scale.set(
          ...getScaleFromMatrix(
            ingredientMeshRef.current.instanceMatrix.array,
            currIngredientIndex * itemSize,
          ),
        );

        tempPosition.set(ingredientX, ingredientY, ingredientZ);
        tempScale.set(ingredientScale, ingredientScale, ingredientScale);

        tempObject.position.lerp(tempPosition, 0.1);
        tempObject.scale.lerp(tempScale, 0.1);
        tempObject.updateMatrix();

        ingredientMeshRef.current.setMatrixAt(currIngredientIndex, tempObject.matrix);

        currIngredientIndex += 1;
      });
    });

    if (cocktailMeshRef.current) cocktailMeshRef.current.instanceMatrix.needsUpdate = true;
    if (ingredientMeshRef.current) ingredientMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/** axes for all-cocktails + single cocktails */}
      {selectedCocktail ? (
        Object.keys(relatedCocktails).map((distance, i) => {
          const ringRadius = DISTANCE_RING_RADIUS * ((i + 1) / relatedCocktailRingCount);
          return (
            <React.Fragment key={distance}>
              <HalfCircle
                // start={0}
                // total={2 * Math.PI}
                radius={ringRadius}
              />

              <mesh position={[0, ringRadius, 0]}>
                <circleGeometry args={[0.001, 0]} />
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
                  {Number(distance) === 0 ? 'Same ingredients' : `±${distance} ingredients`}
                </Html>
              </mesh>
            </React.Fragment>
          );
        })
      ) : (
        <BalanceAxes radius={size * 0.4} />
      )}

      {/** text labels for related cocktails and selected cocktails */}
      {selectedCocktail && (
        <>
          {layout.nodes().map(node =>
            // hidden
            node.r === 0 ? null : node.cocktail === selectedCocktail.data.name ? (
              // selected cocktail, render ingredients
              <group position={[(node.x - node.r) / size, (node.y - 1.1 * node.r) / size, 0]}>
                {selectedCocktail.children
                  .sort((a, b) => b.data.quantity - a.data.quantity)
                  .map((ingredient, i) => (
                    <group key={i} position={[0.05, -i * 0.02, 0]}>
                      <Text
                        color={categoryColorScaleDark(ingredient.data.category)}
                        scale={0.02}
                        anchorX="right"
                      >
                        {ingredient.data.quantity}oz
                      </Text>
                      <Text
                        position={[0.01, 0, 0]}
                        color={categoryColorScaleDark(ingredient.data.category)}
                        scale={0.02}
                        anchorX="left"
                      >
                        {ingredient.data.verbose_ingredient}
                      </Text>
                    </group>
                  ))}
              </group>
            ) : (
              // related, just render name
              <Text
                key={node.cocktail}
                position={[
                  (node.x + 1.5 * Math.cos(node.theta) * node.r) / size,
                  (node.y + -1.5 * Math.sin(node.theta) * node.r) / size,
                  0,
                ]}
                scale={Math.min(0.01, node.r / size)}
                anchorX="left"
                rotation={[0, 0, -Math.sin(node.theta) * Math.PI * 0.25]}
              >
                {node.cocktail}
              </Text>
            ),
          )}
        </>
      )}

      {/** cocktails instance mesh */}
      <instancedMesh
        key={cocktailCount}
        ref={cocktailMeshRef}
        args={[null, null, cocktailCount]} // [geometry, material, count]
        onPointerOver={e => {
          e.stopPropagation(); // don't trigger hover on other cocktails
          const index = e.instanceId;
          const isSelected =
            selectedCocktail && pack.children?.[index]?.data?.name === selectedCocktail?.data?.name;
          if (!isSelected) setHoveredIndex(e.instanceId);
        }}
        onPointerOut={e => {
          e.stopPropagation(); // don't trigger hover on other cocktails
          setHoveredIndex(null);
        }}
        onClick={e => {
          e.stopPropagation();
          const cocktail = pack.children[e.instanceId];
          if (cocktail) setCocktail(cocktail);
        }}
      >
        <sphereBufferGeometry args={[1, 10, 30]}>
          <instancedBufferAttribute
            attachObject={['attributes', 'color']}
            args={[cocktailColors, 3]}
          />
        </sphereBufferGeometry>
        <meshBasicMaterial side={THREE.BackSide} vertexColors={THREE.VertexColors} />
      </instancedMesh>

      {/** ingredients instance mesh */}
      <instancedMesh
        ref={ingredientMeshRef}
        args={[null, null, ingredientCount]} // [geometry, material, count]
      >
        <sphereBufferGeometry args={[1, 10, 30]}>
          <instancedBufferAttribute
            attachObject={['attributes', 'color']}
            args={[ingredientColors, 3]}
          />
        </sphereBufferGeometry>
        <meshPhongMaterial vertexColors={THREE.VertexColors} shininess={20} />
      </instancedMesh>

      {/** text labels for hoveredIndex instances */}
      {hoveredIndex != null && (
        // Cocktail text label
        <group ref={hoveredCocktailTextRef}>
          {!selectedCocktail && (
            <Text
              scale={0.5}
              outlineWidth={0.1}
              outlineColor="#ffffff"
              anchorX="center"
              anchorY="middle"
              textAlign="center"
            >
              {pack.children[hoveredIndex].data.name}
            </Text>
          )}

          {/** ingredient labels */}
          {pack.children[hoveredIndex].children.map((ingredient, i) => (
            <Text
              key={ingredient.data.verbose_ingredient}
              position={[
                (ingredient.x - ingredient.parent.x) / ingredient.parent.r,
                (ingredient.y - ingredient.parent.y - ingredient.parent.r) / ingredient.parent.r,
                ingredient.r * INGREDIENT_LABEL_SCALE,
              ]}
              scale={INGREDIENT_LABEL_SCALE}
              anchorX="center"
              anchorY="middle"
              textAlign="center"
              outlineWidth={0.1}
              outlineColor={categoryColorScale(ingredient.data.category)}
            >
              {ingredient.data.simple_ingredient === 'fruit'
                ? ingredient.data.ingredient
                : ingredient.data.simple_ingredient}
            </Text>
          ))}
        </group>
      )}
    </>
  );
}
