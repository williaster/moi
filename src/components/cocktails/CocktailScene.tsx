import React, { useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

import Text from '../fry-universe/Text';
import getStaticUrl from '../../utils/getStaticUrl';
import useData from '../../hooks/useData';
import { background, categoryColorScale, text } from './colors';
import IngredientSelect from './IngredientSelect';
import useStore from './appStore';
import cleanRawData from './parsers/cleanRawData';
import getCocktailHierarchy from './parsers/getCocktailHierarchy';
import getCocktailEditDistance from './parsers/getCocktailEditDistance';
import getCocktailLookup from './parsers/getCocktailLookup';
import getCocktailPack from './parsers/getCocktailPack';
import getIngredients from './parsers/getIngredients';
import RadialCocktails from './RadialCocktails';
import SelectedCocktail from './SelectedCocktail';
import useSetCocktailFromUrl from './useSetCocktailFromUrl';

export default function CocktailScene() {
  const {
    size: { width, height },
  } = useThree();

  const size = Math.min(width, height);
  const { selectedIngredients, selectedCocktail, setCocktail } = useStore();

  const { data, loading, error } = useData({
    url: getStaticUrl('static/data/cocktails.json'),
    responseType: 'json',
    parser: cleanRawData,
  });

  const hierarchy = useMemo(() => data && getCocktailHierarchy(data), [data]);

  const pack = useMemo(() => {
    if (!hierarchy) return hierarchy;
    const unfilteredPack = getCocktailPack(hierarchy, size, []);
    if (selectedIngredients) {
      unfilteredPack.children = unfilteredPack.children.filter(cocktail =>
        selectedIngredients.every(filterIngredient =>
          cocktail.data.children.some(
            ingredient => ingredient.simple_ingredient === filterIngredient,
          ),
        ),
      );
    }
    return unfilteredPack;
  }, [hierarchy, size, selectedIngredients]);

  // @TODO filter by selected ingredients
  // const ingredientHierarchy = useMemo(() => pack && getIngredientHierarchy(pack), [pack]);
  const lookup = useMemo(() => pack && getCocktailLookup(pack), [pack]);
  const distance = useMemo(() => hierarchy && getCocktailEditDistance(hierarchy), [hierarchy]);

  // const ingredientPack = useMemo(
  //   () => ingredientHierarchy && getIngredientPack(ingredientHierarchy, size),
  //   [ingredientHierarchy, size],
  // );

  const ingredients = useMemo(() => pack && getIngredients(pack), [pack]);

  useSetCocktailFromUrl(lookup);

  return (
    <>
      {loading && (
        <Text scale={0.05} color={text}>
          Loading
        </Text>
      )}
      {error && (
        <Text scale={0.2} color={text}>
          Error
        </Text>
      )}
      {data && !selectedCocktail && (
        <Html
          calculatePosition={() => [0, 0, 0]}
          style={{
            transform: 'translate(16px, 16px)',
            background: `${background}cc`,
            border: `1px solid ${background}`,
            borderRadius: '4px',
            fontSize: 24,
            padding: '16px 16px',
          }}
        >
          <h2
            style={{
              // color: text,
              padding: 0,
              margin: 0,
              marginBottom: 4,
              color: categoryColorScale('alcohol'),
            }}
          >
            Cocktails
          </h2>
          <IngredientSelect ingredients={ingredients} />
        </Html>
      )}
      {pack && lookup && !selectedCocktail && <RadialCocktails pack={pack} lookup={lookup} />}

      {selectedCocktail && lookup && distance && (
        <SelectedCocktail lookup={lookup} distance={distance} />
      )}
    </>
  );
}
