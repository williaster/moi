/* eslint-disable no-nested-ternary */
import { pack } from 'd3-hierarchy';
import { CocktailHierarchy, CocktailRawHierarchy } from '../types';

export default function getCocktailPack(
  hierarchy: CocktailHierarchy,
  size: number,
  ingredients?: string[],
) {
  const copy = hierarchy.copy();
  if (ingredients) {
    copy.children = copy.children.filter(cocktail =>
      ingredients.every(filterIngredient =>
        cocktail.data.children.some(
          ingredient => ingredient.simple_ingredient === filterIngredient,
        ),
      ),
    );
  }
  return pack<CocktailRawHierarchy>()
    .size([size, size])
    .padding(d => (d.height === 1 ? 1 : d.height === 2 ? 30 : 0))(copy);
}
