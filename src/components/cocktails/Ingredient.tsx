import { MeshProps } from '@react-three/fiber';
import React from 'react';
import { ingredientColorScale } from './colors';
import { CocktailHierarchy } from './parsers/rawData';

export default function Ingredient({
  ingredient,
  r,
  ...meshProps
}: MeshProps & {
  ingredient: CocktailHierarchy['children'][number]['children'][number];
  r: number;
}) {
  return (
    <mesh {...meshProps}>
      <sphereGeometry args={[r, 10, 10]} />
      <meshStandardMaterial color={ingredientColorScale(ingredient.data.simple_ingredient)} />
    </mesh>
  );
}
