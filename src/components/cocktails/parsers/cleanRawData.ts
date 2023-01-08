/* eslint-disable no-nested-ternary */
import { RawData } from '../types';

/** this function cleans up ingredient names and filters cocktails. */
export default function cleanRawData(rawData: RawData): RawData {
  const cleaned: RawData = {};

  Object.entries(rawData).forEach(([cocktail, ingredients]) => {
    const cleanIngredients = {};

    Object.entries(ingredients).forEach(([ingredientName, ingredient]) => {
      let simpleIngredient = ingredient.simple_ingredient
        .replace(
          /liqueur \((.*)\)/,
          '$1', // liqueur (allspice dram) => allspice dram
        )
        .replace(
          /juice \((.*)\)/,
          '$1', // juice (lime) => lime
        )
        .replace(
          /(aperitif) \(.*\)/,
          '$1', // aperitif (salers gentian) => aperitif
        );

      if (simpleIngredient === 'agave') {
        simpleIngredient = ingredient.verbose_ingredient.match(/tequila/g)
          ? 'tequila'
          : ingredient.verbose_ingredient.match(/mezcal/g)
          ? 'mezcal'
          : 'agave';
      }
      if (simpleIngredient === 'wine' || simpleIngredient === 'madeira') {
        simpleIngredient = ingredient.verbose_ingredient.match(/port|madeira/g) ? 'port' : 'wine';
      }

      cleanIngredients[ingredientName] = {
        ...ingredient,
        simple_ingredient: simpleIngredient,
        category: ingredient.ingredient.match(/liqueur/gi)
          ? 'liqueur'
          : ingredient.ingredient.match(/bitters/gi)
          ? 'bitters'
          : ingredient.verbose_ingredient.match(/coin|twist|leaf|leaves|wedge|wheel|crescent/gi)
          ? 'garnish'
          : ingredient.verbose_ingredient.match(/flower water|soda|celery juice/gi)
          ? 'other'
          : ingredient.ingredient.match(/soda|curd|marmalade|shrub|cordial/)
          ? 'sweet'
          : ingredient.ingredient.match(/lemon|lime|grapefruit|orange/gi)
          ? 'citrus'
          : ingredient.ingredient.match(/vermouth/gi)
          ? 'liqueur'
          : ingredient.category,
        quantity:
          ingredient.quantity *
          // scale quantities down
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
