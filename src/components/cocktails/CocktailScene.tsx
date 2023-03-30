import React, { useMemo } from 'react';
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
import SelectedCocktail from './SelectedCocktail';
import useSetCocktailFromUrl from './hooks/useSetCocktailFromUrl';
import CocktailLayout from './CocktailLayout';
import IngredientPack from './IngredientPack';
import getIngredientHierarchy from './parsers/getIngredientHierarchy';
import getIngredientPack from './parsers/getIngredientPack';
import { CocktailHierarchy } from './types';
import getRelatedCocktails from './parsers/getRelatedCocktails';

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
  const lookupHierarchy = useMemo(() => hierarchy && getCocktailLookup(hierarchy), [hierarchy]);
  const distance = useMemo(() => hierarchy && getCocktailEditDistance(hierarchy), [hierarchy]);
  const relatedCocktails = useMemo(
    () =>
      lookupHierarchy &&
      getRelatedCocktails({ distance, lookup: lookupHierarchy, selectedCocktail }),
    [selectedCocktail, lookupHierarchy, distance],
  );

  const pack = useMemo(() => {
    if (!hierarchy) return hierarchy;

    const unfilteredPack = getCocktailPack(hierarchy, size);

    if (selectedCocktail) {
      const related = Object.keys(relatedCocktails ?? {}).reduce((all, distance) => {
        Object.keys(relatedCocktails[distance]).forEach((cocktail: string) => {
          all.add(cocktail);
        });
        return all;
      }, new Set<string>());

      console.log('filtering pack', { relatedCocktails, related });

      related.add(selectedCocktail.data.name);

      unfilteredPack.children = unfilteredPack.children.map(cocktail => {
        const isRelated = related.has(cocktail.data.name);
        return isRelated ? cocktail : { ...cocktail, data: { ...cocktail.data, hidden: true } };
      });
    }

    if (selectedIngredients) {
      unfilteredPack.children = unfilteredPack.children.map(cocktail => {
        const hasAllSelectedIngredients = selectedIngredients.every(filterIngredient =>
          cocktail.data.children.some(
            ingredient =>
              ingredient.simple_ingredient === filterIngredient ||
              ingredient.verbose_ingredient === filterIngredient,
          ),
        );

        return hasAllSelectedIngredients
          ? cocktail
          : { ...cocktail, data: { ...cocktail.data, hidden: true } };
      });
    }

    return unfilteredPack;
  }, [hierarchy, size, selectedIngredients, selectedCocktail, relatedCocktails]);

  const lookup = useMemo(() => pack && getCocktailLookup(pack), [pack]);

  // const ingredientHierarchy = useMemo(() => pack && getIngredientHierarchy(pack), [pack]);
  // const ingredientPack = useMemo(
  //   () => ingredientHierarchy && getIngredientPack(ingredientHierarchy, size),
  //   [ingredientHierarchy, size],
  // );

  // const ingredients = useMemo(() => pack && getIngredients(pack), [pack]);

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
      {pack && lookup && (
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
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              columnGap: 8,
            }}
          >
            {selectedCocktail ? selectedCocktail.data.name : 'Cocktails'}
            {selectedCocktail && (
              <button
                type="button"
                style={{
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.5em',
                }}
                onClick={() => setCocktail(null)}
              >
                x
              </button>
            )}
          </h2>
          <IngredientSelect pack={pack} lookup={lookup} />
        </Html>
      )}
      {/* {pack && lookup && !selectedCocktail && <RadialCocktails pack={pack} lookup={lookup} />} */}
      {pack && lookup && relatedCocktails && (
        <CocktailLayout pack={pack} lookup={lookup} relatedCocktails={relatedCocktails} />
      )}

      {/* {ingredientPack && <IngredientPack ingredientPack={ingredientPack} />} */}

      {/* {selectedCocktail && lookup && distance && (
        <SelectedCocktail lookup={lookup} distance={distance} />
      )} */}
    </>
  );
}
