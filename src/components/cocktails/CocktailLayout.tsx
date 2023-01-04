/* eslint-disable no-undef */
import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import getCocktailPack from './parsers/getCocktailPack';
import getCocktailLookup from './parsers/getCocktailLookup';
import useAxisLayout from './hooks/useAxisLayout';
import BalanceAxes from './BalanceAxes';
import { categoryColorScale } from './colors';

interface CocktailLayoutProps {
  pack: ReturnType<typeof getCocktailPack>;
  lookup: ReturnType<typeof getCocktailLookup>;
}

export default function CocktailLayout({ pack, lookup }: CocktailLayoutProps) {
  // refs + constants
  const {
    size: { width, height },
  } = useThree();
  const size = Math.min(width, height);
  const cocktailMeshRef = useRef<THREE.Mesh>();
  const ingredientMeshRef = useRef<THREE.Mesh>();
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempVec3 = useMemo(() => new THREE.Vector3(), []);
  const tempColor = useMemo(() => new THREE.Color('purple'), []);

  // state
  const [hovered, setHovered] = useState<number | null>(null);

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
            .offsetHSL(0, 0, -0.2)
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
          if (!cocktail) return [];
          return (
            cocktail?.children.flatMap(ingredient =>
              tempColor
                .set(categoryColorScale(ingredient.data.category))
                .offsetHSL(0, 0, -0.2)
                .toArray(),
            ) ?? []
          );
        }),
      ),
    [layout, lookup, tempColor],
  );

  // update per frame
  useFrame(() => {
    let currIngredientIndex = 0;

    layout.nodes().forEach((node, i) => {
      if (!cocktailMeshRef.current) return;
      const isHovered = i === hovered;
      const scaleMultiplier = isHovered ? 5 : 1;
      const cocktail = lookup[node.cocktail];

      if (!cocktail) {
        console.log(`Missing cocktail ${node.cocktail}`);
        return;
      }

      const scale = (scaleMultiplier * cocktail.r) / size;
      const x = node.x / size;
      const y = node.y / size;
      tempObject.position.set(x, y, 0);
      tempObject.scale.set(scale, scale, scale);
      tempObject.updateMatrix();

      cocktailMeshRef.current.setMatrixAt(i, tempObject.matrix);

      // update ingredient circles
      if (cocktail.children.length === 0) {
        console.log(`Missing cocktail ingredients for ${node.cocktail}`);
      }

      cocktail.children.forEach(ingredient => {
        if (!ingredientMeshRef.current) return;

        currIngredientIndex += 1;
        const ingredientScale = (scaleMultiplier * ingredient.r) / size;
        const ingredientX = x + (ingredient.x - ingredient.parent.x) / (size / scaleMultiplier);
        const ingredientY = y + (ingredient.y - ingredient.parent.y) / (size / scaleMultiplier);

        tempObject.position.set(ingredientX, ingredientY, 0);
        tempObject.scale.set(ingredientScale, ingredientScale, ingredientScale);
        tempObject.updateMatrix();

        ingredientMeshRef.current.setMatrixAt(currIngredientIndex, tempObject.matrix);
      });
    });

    if (cocktailMeshRef.current) cocktailMeshRef.current.instanceMatrix.needsUpdate = true;
    if (ingredientMeshRef.current) ingredientMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <BalanceAxes radius={size * 0.7} />
      <instancedMesh
        ref={cocktailMeshRef}
        args={[null, null, cocktailCount]} // [geometry, material, count]
        onPointerOver={e => {
          e.stopPropagation(); // don't trigger hover on other cocktails
          setHovered(e.instanceId);
        }}
        onPointerOut={e => {
          e.stopPropagation(); // don't trigger hover on other cocktails
          setHovered(null);
        }}
        onClick={() => {}}
      >
        <sphereBufferGeometry args={[1, 10, 30]}>
          <instancedBufferAttribute
            attachObject={['attributes', 'color']}
            args={[cocktailColors, 3]}
          />
        </sphereBufferGeometry>

        <meshBasicMaterial
          transparent
          side={THREE.BackSide}
          opacity={0.5}
          vertexColors={THREE.VertexColors}
        />
      </instancedMesh>

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
    </>
  );
}
