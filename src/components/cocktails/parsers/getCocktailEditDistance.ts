import { CocktailHierarchy, Ingredient } from '../types';

export interface PairwiseDistance {
  [cocktailA: string]: { [cocktailB: string]: number };
}

export default function getCocktailEditDistance(
  hierarchy: CocktailHierarchy,
  // whether to return an nxn matrix of distances instead of a lookup
  matrix?: boolean,
) {
  const distances: PairwiseDistance = {};

  // nxn matrix of edit distances
  const distancesArray: number[][] = [];
  let maxDist = 1;

  hierarchy.children.forEach(cocktailA => {
    distances[cocktailA.data.name] = distances[cocktailA.data.name] || {};

    const array: number[] = [];
    if (matrix) distancesArray.push(array);

    hierarchy.children.forEach(cocktailB => {
      distances[cocktailB.data.name] = distances[cocktailB.data.name] || {};
      const aIngredients = cocktailA.data.children.map(d => d.simple_ingredient);
      const bIngredients = cocktailB.data.children.map(d => d.simple_ingredient);

      // eslint-disable-next-line no-use-before-define
      const distance = getEditDistance(aIngredients, bIngredients);

      // @TODO sign?
      distances[cocktailA.data.name][cocktailB.data.name] = distance;
      distances[cocktailB.data.name][cocktailA.data.name] = distance;

      if (matrix) array.push(distance);
      maxDist = Math.max(maxDist, distance);
    });
  });

  return matrix ? distancesArray.map(dist => dist.map(d => d)) : distances;
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

// sanity unit tests not in a test file :O
const a = getEditDistance(['a', 'b'], ['a', 'b']);
if (a !== 0) throw new Error(`Wrong got ${a}`);

const b = getEditDistance(['a', 'b', 'c'], ['a', 'b']);
if (b !== 1) throw new Error(`Wrong got ${b}`);

const c = getEditDistance(['a', 'b', 'c'], ['b']);
if (c !== 2) throw new Error(`Wrong got ${c}`);

const d = getEditDistance(['b'], ['a', 'b', 'c']);
if (d !== 2) throw new Error(`Wrong got ${d}`);

const e = getEditDistance(['a', 'b'], ['c', 'd']);
if (e !== 2) throw new Error(`Wrong got ${e}`);

const f = getEditDistance(['c', 'd'], ['a', 'b']);
if (f !== 2) throw new Error(`Wrong got ${f}`);
