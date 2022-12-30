import { scaleOrdinal } from '@visx/scale';

export const background = '#ccc'; //'#87A9D4';
export const text = '#fff';
export const purple = '#9D7EE3';
export const blue = '#6497D7';
export const red = '#DB83A0';
export const orange = '#FF9E68';
export const brown = '#BF9818';
export const yellow = '#D7C293';
export const green = '#A5C58C';
export const gray = '#C5C5C5';
export const white = '#fff';

export const ingredientColorPairs = [
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
  domain: ingredientColorPairs.map(([name]) => name),
  range: ingredientColorPairs.map(([, color]) => color),
}).unknown('#fff');

// const alcohol = '#58508d';
// const sweet = '#bc5090';
// const liqueur = '#ff6361';
// const acid = '#ffa600';

// const alcohol = '#7B2869';
// const liqueur = '#ff6361';
// const sweet = '#C85C8E';
// const acid = '#ffa600';

// const alcohol = '#610C63';
// const liqueur = '#810955';
// const sweet = '#ff6361';
// const acid = '#FFF9D7';

// const alcohol = '#293462';
// const liqueur = '#F24C4C';
// const sweet = '#EC9B3B';
// const acid = '#F7D716';

const alcohol = orange;
const liqueur = yellow;
const sweet = purple;
const acid = '#F7D716';

const categoryColorPairs = [
  ['spirit', alcohol],
  ['alcohol', alcohol],

  ['liqueur', liqueur],
  ['sweet', sweet],

  ['citrus', acid],
  ['acid', acid],

  ['bitters', gray],
  ['other', gray],
  ['garnish', gray],
];

export const categoryColorScale = scaleOrdinal({
  domain: categoryColorPairs.map(([name]) => name),
  range: categoryColorPairs.map(([, color]) => color),
}).unknown('#222');
