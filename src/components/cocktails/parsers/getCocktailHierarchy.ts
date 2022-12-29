import { hierarchy } from 'd3-hierarchy';
import { RawData, CocktailHierarchy, CocktailRawHierarchy, IngredientChild } from '../types';

export default function getCocktailHierarchy(rawData: RawData): CocktailHierarchy {
  const cocktailRawHierarchy: CocktailRawHierarchy[] = [];

  Object.entries(rawData).forEach(([cocktail, ingredients]) => {
    const cocktailHierarchy: CocktailRawHierarchy = {
      name: cocktail,
      type: 'cocktail',
      // value is derived in the hierarchy() invocation, and is the sum of child ingredients
      value: 0,
      children: [],
    };

    Object.entries(ingredients).forEach(([ingredientName, ingredient]) => {
      const ingredientChild: IngredientChild = {
        ...ingredient,
        type: 'ingredient',
        name: ingredientName,
        value: ingredient.quantity,
      };

      cocktailHierarchy.children.push(ingredientChild);
    });

    cocktailRawHierarchy.push(cocktailHierarchy);
  });

  // coerce here because root children aren't the same as a cocktail
  return (hierarchy({
    type: 'root' as const,
    name: 'root',
    value: 0,
    children: cocktailRawHierarchy,
  }).sum(d => d.value) as unknown) as CocktailHierarchy;
}
