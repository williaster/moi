/* eslint-disable camelcase */
import { CocktailHierarchy } from '../types';

interface IngredientMetaData {
  [simple_ingredient: string]: {
    simple_ingredient: string;
    category: string;
    cocktail_count: number;
    fraction_cocktails: number;
    verbose_ingredients: { [key: string]: number };
  };
}

/** returns metadata about ingredients inside the cocktail hierarchy. */
export default function getIngredients(hierarchy: CocktailHierarchy): IngredientMetaData {
  const ingredients: IngredientMetaData = {};
  const cocktailCount = hierarchy.children.length;

  hierarchy.children.forEach(cocktail =>
    cocktail.data.children.forEach(({ simple_ingredient, verbose_ingredient, category }) => {
      ingredients[simple_ingredient] = ingredients[simple_ingredient] || {
        simple_ingredient,
        cocktail_count: 0,
        fraction_cocktails: 0,
        category,
        verbose_ingredients: {},
      };

      ingredients[simple_ingredient].cocktail_count += 1;
      ingredients[simple_ingredient].fraction_cocktails =
        ingredients[simple_ingredient].cocktail_count / cocktailCount;

      ingredients[simple_ingredient].verbose_ingredients[verbose_ingredient] =
        ingredients[simple_ingredient].verbose_ingredients[verbose_ingredient] || 0;

      ingredients[simple_ingredient].verbose_ingredients[verbose_ingredient] += 1;
    }),
  );

  return ingredients;
}
