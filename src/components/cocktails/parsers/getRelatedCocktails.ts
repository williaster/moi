import { AppState } from '../appStore';
import { CocktailHierarchy } from '../types';
import getCocktailEditDistance from './getCocktailEditDistance';
import getCocktailLookup from './getCocktailLookup';

interface GetRelatedCocktailsOptions {
  distance: ReturnType<typeof getCocktailEditDistance>;
  selectedCocktail: AppState['selectedCocktail'];
  lookup: ReturnType<typeof getCocktailLookup>;
}

export interface RelatedCocktails {
  [distance: number]: { [name: string]: CocktailHierarchy };
}

export default function getRelatedCocktails({
  distance,
  selectedCocktail,
  lookup,
}: GetRelatedCocktailsOptions): RelatedCocktails {
  if (!selectedCocktail) return {};

  const cocktailDistances = distance[selectedCocktail.data.name];

  const top20 = Object.entries(cocktailDistances)
    .sort((a, b) => a[1] - b[1])

    //
    .filter(
      ([name, distance], i) =>
        name !== selectedCocktail.data.name &&
        // min of distance 2 or at least 20 results
        (distance < 3 || i <= 21),
    ) as [string, number][];

  const topByDistance = top20.reduce<RelatedCocktails>((all, curr) => {
    const [name, dist] = curr;
    all[dist] = all[dist] || {};
    all[dist][name] = lookup[name];
    if (!lookup[name]) console.error(`Missing cocktail ${name}`);
    return all;
  }, {});

  return topByDistance;
}
