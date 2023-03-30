import { hierarchy } from 'd3-hierarchy';
import { RawData, CocktailHierarchy, CocktailRawHierarchy, IngredientChild } from '../types';

export default function getCocktailHierarchy(rawData: RawData): CocktailHierarchy {
  const cocktailRawHierarchy: CocktailRawHierarchy[] = [];

  const balanceExtent = {
    alcohol: [Infinity, -Infinity],
    acid: [Infinity, -Infinity],
    sweet: [Infinity, -Infinity],
  };

  Object.entries(rawData).forEach(([cocktail, ingredients]) => {
    const cocktailHierarchy: CocktailRawHierarchy = {
      name: cocktail,
      type: 'cocktail',
      // value is derived in the hierarchy() invocation, and is the sum of child ingredients
      value: 0,
      children: [],
      balance: {
        acid: 0,
        sweet: 0,
        alcohol: 0,
      },
    };

    Object.entries(ingredients).forEach(([ingredientName, ingredient]) => {
      const ingredientChild: IngredientChild = {
        ...ingredient,
        type: 'ingredient',
        name: ingredientName,
        value: ingredient.quantity,
      };

      // update cocktail balance
      switch (ingredient.category) {
        case 'spirit':
        case 'alcohol':
          cocktailHierarchy.balance.alcohol += ingredient.quantity;
          break;
        case 'liqueur':
          cocktailHierarchy.balance.alcohol += 0.7 * ingredient.quantity;
          cocktailHierarchy.balance.sweet += 0.3 * ingredient.quantity;
        case 'sweet':
          cocktailHierarchy.balance.sweet += ingredient.quantity;
          break;
        case 'citrus':
          cocktailHierarchy.balance.acid += ingredient.quantity;
          break;
        default:
      }

      cocktailHierarchy.children.push(ingredientChild);
    });

    cocktailRawHierarchy.push(cocktailHierarchy);
  });

  const balanceAxes = ['acid', 'alcohol', 'sweet'];

  // scale entire balance to sum to 1
  cocktailRawHierarchy.forEach(cocktail => {
    const sum = balanceAxes.reduce((total, axis) => total + cocktail.balance[axis], 0);

    balanceAxes.forEach(axis => {
      cocktail.balance[axis] /= sum;
    });

    // update overall extent
    Object.entries(cocktail.balance).forEach(([axis, value]) => {
      balanceExtent[axis][0] = Math.min(balanceExtent[axis][0], value);
      balanceExtent[axis][1] = Math.max(balanceExtent[axis][1], value);
    });
  });

  // normalize cocktail balance axes to [0, 1]
  cocktailRawHierarchy.forEach(cocktail => {
    balanceAxes.forEach(axis => {
      const value = cocktail.balance[axis];
      const [min, max] = balanceExtent[axis];
      cocktail.balance[axis] = (value - min) / (max - min);
    });

    if (['brooklyn', 'manhattan'].includes(cocktail.name)) console.log(cocktail);
  });

  // // normalize cocktail balance axes to [0, 1]
  // cocktailRawHierarchy.forEach(cocktail => {
  //   balanceAxes.forEach(axis => {
  //     const value = cocktail.balance[axis];
  //     const [min, max] = balanceExtent[axis];
  //     cocktail.balance[axis] = (value - min) / (max - min);
  //   });
  // });

  // // now scale entire balance to [0, 1]
  // cocktailRawHierarchy.forEach(cocktail => {
  //   const sum = balanceAxes.reduce((total, axis) => total + cocktail.balance[axis], 0);

  //   balanceAxes.forEach(axis => {
  //     cocktail.balance[axis] /= sum;
  //   });

  //   if (['brooklyn', 'manhattan'].includes(cocktail.name)) console.log(cocktail);
  // });

  // coerce here because root children aren't the same as a cocktail
  return (hierarchy({
    type: 'root' as const,
    name: 'root',
    value: 0,
    children: cocktailRawHierarchy,
  }).sum(d => d.value) as unknown) as CocktailHierarchy;
}
