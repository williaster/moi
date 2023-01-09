/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import getCocktailPack from './parsers/getCocktailPack';
import getCocktailLookup from './parsers/getCocktailLookup';
import useAxisLayout from './hooks/useAxisLayout';
import BalanceAxes from './BalanceAxes';
import { categoryColorScale, ingredientColorScale } from './colors';
import Text from '../fry-universe/Text';
import useStore from './appStore';

interface CocktailLayoutProps {
  pack: ReturnType<typeof getCocktailPack>;
  lookup: ReturnType<typeof getCocktailLookup>;
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

export default function CocktailLayout({ pack, lookup }: CocktailLayoutProps) {
  // refs + constants
  const {
    size: { width, height },
  } = useThree();
  const size = Math.min(width, height);
  const cocktailMeshRef = useRef<THREE.Mesh>();
  const ingredientMeshRef = useRef<THREE.Mesh>();
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempPosition = useMemo(() => new THREE.Vector3(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const tempColor = useMemo(() => new THREE.Color('purple'), []);

  // state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { setCocktail } = useStore();

  // counts
  const cocktailCount = pack.children.length;
  const ingredientCount = useMemo(
    () => pack.children.reduce((sum, cocktail) => sum + (cocktail?.children?.length ?? 0), 0),
    [pack],
  );

  // layout
  const layout = useAxisLayout({ pack, lookup });
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

  const cocktailTextRef = useRef<THREE.Group>();

  // update per frame
  useFrame(() => {
    let currIngredientIndex = 0;

    layout.nodes().forEach((node, i) => {
      if (!cocktailMeshRef.current) return;
      const isHovered = i === hoveredIndex;
      const scaleMultiplier = isHovered ? 5 : 1;
      const cocktail = lookup[node.cocktail];
      const isHidden = cocktail?.data.hidden;

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

      // computed based on the latest layout
      const scale = isHidden ? 0 : (scaleMultiplier * cocktail.r) / size;
      const x = node.x / size;
      const y = node.y / size;
      const z = isHovered ? scale : 0;

      tempPosition.set(x, y, z);
      tempScale.set(scale, scale, scale);

      tempObject.position.lerp(tempPosition, 0.1);
      tempObject.scale.lerp(tempScale, 0.1);
      tempObject.updateMatrix();

      cocktailMeshRef.current.setMatrixAt(i, tempObject.matrix);

      if (isHovered && cocktailTextRef.current) {
        cocktailTextRef.current.position.set(x, y + scale * 1.1, scale * 2);
        cocktailTextRef.current.scale.set(scale, scale, scale);
      }

      // update ingredient circles
      if (cocktail.children.length === 0) {
        console.log(`Missing cocktail ingredients for ${node.cocktail}`);
      }

      cocktail.children.forEach(ingredient => {
        if (!ingredientMeshRef.current) return;

        const ingredientScale = isHidden ? 0 : (scaleMultiplier * ingredient.r) / size;
        const ingredientX = x + (ingredient.x - ingredient.parent.x) / (size / scaleMultiplier);
        const ingredientY = y + (ingredient.y - ingredient.parent.y) / (size / scaleMultiplier);
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
      <BalanceAxes radius={size * 0.7} />

      {/** cocktails */}
      <instancedMesh
        key={cocktailCount}
        ref={cocktailMeshRef}
        args={[null, null, cocktailCount]} // [geometry, material, count]
        onPointerOver={e => {
          e.stopPropagation(); // don't trigger hover on other cocktails
          setHoveredIndex(e.instanceId);
          console.log(lookup[pack.children[e.instanceId].data.name].children.map(i => i.data));
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

      {/** ingredients */}
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
        <group ref={cocktailTextRef}>
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
              {ingredient.data.simple_ingredient}
            </Text>
          ))}
        </group>
      )}
    </>
  );
}
