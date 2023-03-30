import { HierarchyCircularNode, HierarchyNode } from 'd3-hierarchy';

export interface Ingredient {
  cocktail: string;
  ingredient: string;
  simple_ingredient: string;
  verbose_ingredient: string;
  quantity: number;
  category: string;
}

export interface RawCocktail {
  [ingredient: string]: Ingredient;
}

export interface RawData {
  [cocktail: string]: RawCocktail;
}

export type IngredientChild = Ingredient & {
  type: 'ingredient';
  name: string;
  value: number;
};

/** This is the Datum input for the hierarchy. */
export interface CocktailRawHierarchy {
  type: 'cocktail';
  name: string;
  value: number;
  balance: {
    acid: number;
    sweet: number;
    alcohol: number;
  };
  children: IngredientChild[];
  hidden?: boolean;
}

export interface CocktailRawRoot {
  type: 'root';
  name: string;
  value: number;
  children: CocktailRawHierarchy[];
}

export type CocktailHierarchy = HierarchyNode<CocktailRawHierarchy>;
export type IngredientHierarchy = HierarchyNode<IngredientChild>;
export type CocktailPack = HierarchyCircularNode<CocktailRawHierarchy>;
