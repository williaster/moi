/* eslint-disable no-undef */
import { useLayoutEffect, useMemo } from 'react';
import useStore from './appStore';
import getCocktailLookup from './parsers/getCocktailLookup';

export default function useSetCocktailFromUrl(lookup: ReturnType<typeof getCocktailLookup>) {
  const { setCocktail } = useStore();

  const urlCocktail = useMemo(
    () => new URLSearchParams(window.location.search).get('cocktail'),
    [],
  );

  useLayoutEffect(() => {
    if (urlCocktail && lookup && lookup[urlCocktail]) {
      console.log('Initializing cocktail', urlCocktail);
      setCocktail(lookup[urlCocktail]);
    }
  }, [urlCocktail, lookup, setCocktail]);
}
