import { CocktailHierarchy } from '../types';

export default function getCocktailLookup(cocktailHierarchy: CocktailHierarchy) {
  const cocktailLookup: {
    [cocktail: string]: CocktailHierarchy;
  } = cocktailHierarchy.children.reduce((all, curr) => {
    // eslint-disable-next-line no-param-reassign
    all[curr.data.name] = curr;
    return all;
  }, {});

  return cocktailLookup;
}
