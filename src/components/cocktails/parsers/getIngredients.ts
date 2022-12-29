import { CocktailHierarchy } from '../types';

export default function getIngredients(hierarchy: CocktailHierarchy) {
  // @TODO could add verbose name for better matches
  const ingredients: { [name: string]: number } = {};

  hierarchy.children.forEach(cocktail =>
    cocktail.data.children.forEach(ingredient => {
      ingredients[ingredient.simple_ingredient] = ingredients[ingredient.simple_ingredient] || 0;
      ingredients[ingredient.simple_ingredient] += 1;
    }),
  );

  return Object.keys(ingredients).sort((a, b) => ingredients[b] - ingredients[a]);
}
