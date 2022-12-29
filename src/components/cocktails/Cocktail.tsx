import { useThree } from '@react-three/fiber';
import React, { useState } from 'react';
import Text from '../fry-universe/Text';
import { textColorDarker } from './colors';
import Ingredient from './Ingredient';
import { CocktailDatum, CocktailHierarchy, PairwiseDistance } from './parsers/rawData';

interface CocktailProps {
  cocktail: string;
  lookup: { [cocktail: string]: CocktailHierarchy };
  distances: PairwiseDistance;
}

export default function Cocktail({ cocktail: cocktailName, distances, lookup }: CocktailProps) {
  const cocktail = lookup[cocktailName];
  const { r } = cocktail;

  const [isHovered, setIsHovered] = useState(false);
  const ingredients = cocktail.children;
  const {
    size: { width, height },
  } = useThree();
  const size = Math.max(width, height);
  console.log(ingredients);

  return (
    <group position={[-0.5, 0.5, 0]} scale={[5, 5, 5]}>
      <mesh onPointerOver={() => setIsHovered(true)} onPointerOut={() => setIsHovered(false)}>
        <sphereGeometry args={[r / 1500, 10, 10]} />
        <meshStandardMaterial color={textColorDarker} transparent opacity={0.1} />
      </mesh>

      <Text position={[0, 0.02, 0]} scale={0.005}>
        {cocktailName}
      </Text>

      {ingredients.map((ingredient, i) => (
        <React.Fragment key={i}>
          <Ingredient
            key={i}
            ingredient={ingredient}
            r={ingredient.r / size}
            position={[
              (ingredient.x - ingredient.parent.x) / size,
              (ingredient.y - ingredient.parent.y) / size,
              0,
            ]}
          />
          <Text position={[0.02, 0.01 - i * 0.003, r / 1500]} scale={0.003} anchorX="left">
            {ingredient.data.name}
          </Text>
        </React.Fragment>
      ))}
    </group>
  );
}
