import { scaleOrdinal } from '@visx/scale';

export const background = '#87A9D4';
export const text = '#fff';
export const purple = '#9D7EE3';
export const blue = '#6497D7';
export const red = '#DB83A0';
export const orange = '#FF9E68';
export const brown = '#BF9818';
export const yellow = '#D7C293';
export const green = '#A5C58C';
export const gray = '#C5C5C5';

export const colorPairs = [
  ['lime', green],
  ['pear', green],
  ['apple', green],
  ['leaf', green],
  ['batavia arrack', green],
  ['chartreuse', green],
  ['absinthe', green],
  ['mint', green],
  ['crème de menthe', green],
  ['agave', green],
  ['caraway', green],
  ['celery', green],
  ['vegetable', green],
  ['pine', green],

  ['lemon', yellow],
  ['egg', yellow],
  ['elderflower', yellow],
  ['butter', yellow],
  ['pineapple', yellow],

  ['soda', blue],
  ['water', blue],

  ['blackberry', purple],
  ['crème de violette', purple],
  ['crème yvette', purple],

  ['strawberry', red],
  ['cherry', red],
  ['raspberry', red],
  ['cherry heering', red],
  ['rose', red],
  ['watermelon', red],
  ['wine', red],
  ['madeira', red],
  ['cordial', red],
  ['salers gentian', red],

  ['cantaloupe', orange],
  ['apricot', orange],
  ['beer', orange],
  ['cider', orange],
  ['grapefruit', orange],
  ['peach', orange],
  ['orange', orange],
  ['blood orange', orange],

  ['rum', brown],
  ['vermouth', brown],
  ['whiskey', brown],
  ['brandy', brown],
  ['amaro', brown],
  ['sherry', brown],
  ['bitters', brown],
  ['cocchi americano', brown],
  ['crème de cacao', brown],
  ['almond', brown],

  ['sugar', gray],
  ['falernum', gray],
  ['cachaça', gray],
  ['gin', gray],
  ['vodka', gray],
  ['sugar', gray],
  ['salt', gray],
  ['coconut', gray],
  ['sugar cube', gray],
];

/** Map ingredient name to a color. */
export const ingredientColorScale = scaleOrdinal({
  domain: colorPairs.map(([name]) => name),
  range: colorPairs.map(([, color]) => color),
}).unknown('#fff');
