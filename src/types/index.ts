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

// User types
export interface User {
  id: string; // UUID
  email: string;
  password: string; // hashed
  name: string;
  birthday?: string; // ISO 8601 date format (YYYY-MM-DD) - optional
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  birthday?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  birthday?: string; // Optional, format: YYYY-MM-DD
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  message: string;
}
