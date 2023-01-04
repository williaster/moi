import { useCallback } from 'react';

export default function useUrlCocktail() {
  const set = useCallback((cocktail: string | null) => {
    const query = new URLSearchParams(window.location.search);

    if (cocktail) query.set('cocktail', cocktail);
    else query.delete('cocktail');

    const url = `${window.location.pathname}?${query.toString()}`;
    window.history.pushState(null, '', url);
  }, []);

  return set;
}
