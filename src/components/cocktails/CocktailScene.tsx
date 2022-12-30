import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

import Text from '../fry-universe/Text';
import getStaticUrl from '../../utils/getStaticUrl';
import useData from '../../hooks/useData';
import { background, blue, ingredientColorScale, text } from './colors';
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
import IngredientPack from './IngredientPack';
import CocktailPack from './CocktailPack';
import IngredientIcicle from './IngredientIcicle';
import RadialCocktails from './RadialCocktails';

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
  const ingredientHierarchy = useMemo(() => pack && getIngredientHierarchy(pack), [pack]);

  const lookup = useMemo(() => pack && getCocktailLookup(pack), [pack]);
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
      {/* {data && <CocktailPack {...parsedData} />} */}
      {pack && lookup && <RadialCocktails pack={pack} lookup={lookup} />}
      {/* {ingredientHierarchy && <IngredientIcicle hierarchy={ingredientHierarchy} />} */}
      {/* {ingredientPack && <IngredientPack ingredientPack={ingredientPack} />} */}
    </>
  );
}
