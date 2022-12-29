/* eslint-disable camelcase */
import { hierarchy } from 'd3-hierarchy';
import { CocktailHierarchy } from '../types';

export default function getIngredientHierarchy(cocktailHierarchy: CocktailHierarchy) {
  // model the ingredient hierarchy as
  //  category -> simple-ingredient -> verbose-ingredient
  const ingredientRawHierarchy: {
    [category: string]: { [simpleIngredient: string]: { [verboseIngredient: string]: number } };
  } = {};

  cocktailHierarchy.children.forEach(cocktail => {
    cocktail.data.children.forEach(ingredient => {
      const { category: cat, simple_ingredient: simple, verbose_ingredient: verbose } = ingredient;

      // lazy-create every nesting
      ingredientRawHierarchy[cat] = ingredientRawHierarchy[cat] || {};
      ingredientRawHierarchy[cat][simple] = ingredientRawHierarchy[cat][simple] || {};
      ingredientRawHierarchy[cat][simple][verbose] =
        ingredientRawHierarchy[cat][simple][verbose] || 0;

      ingredientRawHierarchy[cat][simple][verbose] += 1;
    });
  });

  return hierarchy({
    type: 'root',
    name: 'root',
    value: 0,
    children: Object.entries(ingredientRawHierarchy).map(([category, simples]) => ({
      type: 'category',
      name: category,
      value: 0,
      children: Object.entries(simples).map(([simple, verboses]) => ({
        type: 'simple_ingredient',
        name: simple,
        value: 0,
        children: Object.entries(verboses).map(([verbose, value]) => ({
          type: 'verbose_ingredient',
          name: verbose,
          value,
        })),
      })),
    })),
  }).sum(d => d.value);
}
