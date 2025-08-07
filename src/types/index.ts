export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  cookTime: number;
  calories: number;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
}

export interface RecipeListItem {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  category: string;
  cookTime: number;
  calories: number;
  image: string;
}

export interface RecipeFilters {
  categoryId?: string;
  keyword?: string;
}
