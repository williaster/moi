import { hierarchy, HierarchyNode } from 'd3-hierarchy';

export interface Cocktail {
  [ingredient: string]: Ingredient;
}

export interface Ingredient {
  cocktail: string;
  ingredient: string;
  simple_ingredient: string;
  verbose_ingredient: string;
  quantity: number;
  category: string;
}

export interface RawData {
  [cocktail: string]: Cocktail;
}

export interface CocktailRawHierarchy<D> {
  type: 'cocktail' | 'root';
  name: string;
  value: number;
  children: (D & {
    type: 'ingredient';
    name: string;
    value: number;
  })[];
}

export function rawDataToCocktailHierarchy(rawData: RawData) {
  const result: CocktailRawHierarchy<Ingredient>[] = [];

  Object.entries(rawData).forEach(([cocktail, ingredients]) => {
    const cocktailHierarchy: CocktailRawHierarchy<Ingredient> = {
      name: cocktail,
      type: 'cocktail',
      value: 0,
      children: [],
    };

    Object.entries(ingredients).forEach(([ingredientName, ingredient]) => {
      cocktailHierarchy.children.push({
        ...ingredient,
        type: 'ingredient',
        name: ingredientName,
        value: ingredient.quantity,
        simple_ingredient: ingredient.simple_ingredient
          .replace(
            /liqueur \((.*)\)/,
            '$1', // liqueur (allspice dram) => allspice dram
          )
          .replace(
            /juice \((.*)\)/,
            '$1', // juice (lime) => lime
          )
          .replace(
            /aperitif \((.*)\)/,
            '$1', // aperitif (salers gentian) => salers gentian
          ),
        category: ingredient.ingredient.match(/lemon|lime|grapefruit|orange/)
          ? 'citrus'
          : ingredient.ingredient.match(/bitters/gi)
          ? 'bitters'
          : ingredient.category,
      });
    });

    if (
      cocktailHierarchy.children.length > 0 &&
      !cocktailHierarchy.name.match(/punch|east river|jersey lightning/)
    ) {
      result.push(cocktailHierarchy);
    }
  });

  return hierarchy({
    type: 'root',
    name: 'root',
    value: 0,
    children: result,
  }).sum(d => d.value);
}

export type CocktailHierarchy = ReturnType<typeof rawDataToCocktailHierarchy>;

export function cocktailHierarchyToIngredientHierarchy(
  cocktailHierarchy: CocktailHierarchy['children'],
) {
  const ingredientCounts: Record<string, number> = {};

  cocktailHierarchy?.forEach(cocktail => {
    cocktail.children?.forEach(ingredient => {
      ingredientCounts[ingredient.data.simple_ingredient] =
        (ingredientCounts[ingredient.data.simple_ingredient] || 0) + 1;
    });
  });

  return hierarchy({
    type: 'root',
    name: 'root',
    value: 0,
    children: Object.entries(ingredientCounts).map(([ingredient, count]) => ({
      type: 'ingredient',
      name: ingredient,
      value: count,
    })),
  }).sum(d => d.value);
}

export type IngredientHierarchy = ReturnType<typeof cocktailHierarchyToIngredientHierarchy>;

export interface PairwiseDistance {
  [cocktailA: string]: { [cocktailB: string]: number };
}

export interface CocktailDatum {
  type: 'cocktail';
  name: string;
  children: Ingredient[];
}

export function getCocktailPairwiseDistance(cocktails: { children: { data: CocktailDatum }[] }) {
  const distances: PairwiseDistance = {};
  // nxn matrix of edit distances
  const distancesArray: number[][] = [];
  let maxDist = 1;

  cocktails.children.map((cocktailA, i) => {
    distances[cocktailA.data.name] = distances[cocktailA.data.name] || {};

    const array: number[] = [];
    distancesArray.push(array);

    cocktails.children.map((cocktailB, j) => {
      distances[cocktailB.data.name] = distances[cocktailB.data.name] || {};
      const aIngredients = cocktailA.data.children.map(i => i.simple_ingredient);
      const bIngredients = cocktailB.data.children.map(i => i.simple_ingredient);

      const distance = getEditDistance(aIngredients, bIngredients);

      // @TODO sign?
      distances[cocktailA.data.name][cocktailB.data.name] = distance;
      distances[cocktailB.data.name][cocktailA.data.name] = distance;

      array.push(distance);
      maxDist = Math.max(maxDist, distance);
    });
  });

  return {
    lookup: distances,
    array: distancesArray.map(dist =>
      dist.map(d => {
        if (isNaN(d)) throw Error('Found nan distance value');
        return d;
      }),
    ),
  };
}

/**
 * computes the edit distance for how to get
 *    a -> b
 *    b -> a
 */
function getEditDistance(a: string[], b: string[]) {
  const setB = new Set(b);

  let aToB = 0;
  let bToA = 0;

  a.forEach(item => {
    if (setB.has(item)) {
      setB.delete(item);
      return;
    }

    // must remove this to get to B
    aToB += 1;
  });

  // must remove any remaining in B to get to A
  bToA += setB.size;

  return aToB + (bToA === 0 ? 0 : Math.abs(aToB - bToA));
}

const a = getEditDistance(['a', 'b'], ['a', 'b']);
if (a !== 0) throw Error(`Wrong got ${a}`);

const b = getEditDistance(['a', 'b', 'c'], ['a', 'b']);
if (b !== 1) throw Error(`Wrong got ${b}`);

const c = getEditDistance(['a', 'b', 'c'], ['b']);
if (c !== 2) throw Error(`Wrong got ${c}`);

const d = getEditDistance(['b'], ['a', 'b', 'c']);
if (d !== 2) throw Error(`Wrong got ${d}`);

const e = getEditDistance(['a', 'b'], ['c', 'd']);
if (e !== 2) throw Error(`Wrong got ${e}`);

const f = getEditDistance(['c', 'd'], ['a', 'b']);
if (f !== 2) throw Error(`Wrong got ${f}`);
