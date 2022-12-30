/* eslint-disable no-nested-ternary */
import { RawData } from '../types';

/** this function cleans up ingredient names and filters cocktails. */
export default function cleanRawData(rawData: RawData): RawData {
  const cleaned: RawData = {};

  Object.entries(rawData).forEach(([cocktail, ingredients]) => {
    const cleanIngredients = {};

    Object.entries(ingredients).forEach(([ingredientName, ingredient]) => {
      cleanIngredients[ingredientName] = {
        ...ingredient,
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
        category: ingredient.ingredient.match(/bitters/gi)
          ? 'bitters'
          : ingredient.ingredient.match(/lemon|lime|grapefruit|orange/)
          ? 'citrus'
          : ingredient.ingredient.match(/vermouth/gi)
          ? 'liqueur'
          : ingredient.category,
        quantity:
          ingredient.quantity *
          (ingredient.simple_ingredient === 'mint'
            ? 0.25
            : ingredient.simple_ingredient === 'vegetable'
            ? 0.1
            : ingredient.simple_ingredient === 'spice'
            ? 0.25
            : 1),
      };
    });

    if (
      Object.keys(cleanIngredients).length > 0 &&
      // punches are huge quantities and mess up the visuals for now
      !cocktail.match(/punch|east river|jersey lightning/)
    ) {
      cleaned[cocktail] = cleanIngredients;
    }
  });

  return cleaned;
}
