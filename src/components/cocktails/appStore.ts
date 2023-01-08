import create from 'zustand';
import { CocktailHierarchy } from './types';

// app state
export interface AppState {
  selectedCocktail: null | CocktailHierarchy;
  clearCocktail: () => void;
  setCocktail: (c: CocktailHierarchy | null) => void;

  selectedIngredients: null | string[];
  setSelectedIngredients: (i: null | string[]) => void;
}

const useStore = create<AppState>(set => ({
  selectedCocktail: null,
  clearCocktail: () => set({ selectedCocktail: null }),
  setCocktail: selectedCocktail => set({ selectedCocktail, selectedIngredients: null }),
  selectedIngredients: null,
  setSelectedIngredients: (ingredients: string[]) => set({ selectedIngredients: ingredients }),
}));

export default useStore;
