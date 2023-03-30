import { scaleOrdinal } from '@visx/scale';
import * as THREE from 'three';

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

// const alcohol = orange;
// const liqueur = yellow;
// const sweet = purple;
// const acid = '#F7D716';

// good! red/white/blue
// export const background = '#9ED2F7'; //'#87A9D4';
// const alcohol = '#EB455F';
// const liqueur = '#58508d';
// const sweet = '#2B3467';
// const acid = '#F1F7B5';

// mint
export const background = '#C7FDF8'; //'#87A9D4';
const alcohol = '#2C786B'; // '#116058';
const liqueur = '#2ABDA2';
const sweet = '#F7D716';
const acid = '#FF4A4A';

// export const background = '#9ED2F7'; //'#87A9D4';
// const alcohol = '#287ADA'; // '#116058';
// const liqueur = '#ff6361';
// const sweet = '#FF4A4A';
// const acid = '#9ED2F7';

// export const background = '#eaeaea'; //'#87A9D4';
// const alcohol = '#1C54A8';
// const liqueur = '#287ADA';
// const sweet = '#9ED2F7';
// const acid = '#FF4A4A';

// export const background = '#E3FCA4'; //'#87A9D4';
// const alcohol = '#B74374';
// const liqueur = '#443E7A';
// const sweet = '#3E78AA';
// const acid = '#6C9944';

// export const background = '#E3FCA4'; //'#87A9D4';
// const alcohol = '#AA3138';
// const liqueur = '#F69A4D';
// const sweet = '#CFDE55';
// const acid = '#759F53';

// export const background = '#FFC6ED'; //'#87A9D4';
// const alcohol = '#4C3A76';
// const liqueur = '#945287';
// const sweet = '#AA3138';
// const acid = '#F69A4D';

// export const background = '#DCFEE4'; //'#87A9D4';
// const alcohol = '#2C786B';
// const liqueur = '#C7FDF8';
// const sweet = '#2ABDA2';
// const acid = '#CFDE55';

// export const background = '#DCFEE4'; //'#87A9D4';
// const alcohol = '#2C786B';
// const liqueur = '#2ABDA2';
// const sweet = '#C7FDF8';
// const acid = '#CFDE55';

// export const background = '#eaeaea';
// const alcohol = '#E86570';
// const liqueur = '#9ED2F7';
// const sweet = '#232930';
// const acid = '#F8CB46';

// export const background = '#4C3A76';
// const alcohol = '#222222';
// const liqueur = '#767676';
// const sweet = '#ccc';
// const acid = '#fff';

// export const background = '#4C3A76';
// const alcohol = '#190546';
// const liqueur = '#563C94';
// const sweet = '#9376D8';
// const acid = '#FFFFFF';

// export const background = '#222';
// const alcohol = '#9B5A36';
// const liqueur = '#F8CB46';
// const sweet = '#F8CB46';
// const acid = '#FFFFFF';

// const alcohol = 'red';
// const liqueur = 'green';
// const sweet = 'blue';
// const acid = 'yellow';

const categoryColorPairs = [
  ['spirit', alcohol],
  ['alcohol', alcohol],

  ['liqueur', liqueur],
  ['sweet', sweet],

  ['citrus', acid],
  ['citrus-y', acid],
  ['acid', acid],

  ['bitters', gray],
  ['other', gray],
  ['garnish', gray],
];

export const categoryColorScale = scaleOrdinal({
  domain: categoryColorPairs.map(([name]) => name),
  range: categoryColorPairs.map(([, color]) => color),
}).unknown('#222');

const tempColor = new THREE.Color();

export const categoryColorScaleDark = scaleOrdinal({
  domain: categoryColorPairs.map(([name]) => name),
  range: categoryColorPairs.map(
    ([, color]) =>
      `#${tempColor
        .set(color)
        .offsetHSL(0, 0, -0.1)
        .getHexString()}`,
  ),
}).unknown('#222');
