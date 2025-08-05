import { Recipe, RecipeListItem, RecipeListResponse, RecipeDetailResponse, RecipeFilters } from '../types';
import { CategoryService } from './categoryService';
import recipes from '../data/recipes.json';

export class RecipeService {
  private recipes: Recipe[] = recipes as Recipe[];
  private categoryService: CategoryService = new CategoryService();

  public getRecipes(filters?: RecipeFilters): RecipeListResponse {
    let filteredRecipes = this.recipes;

    // Apply filters
    if (filters?.categoryId) {
      filteredRecipes = filteredRecipes.filter(
        recipe => recipe.categoryId === filters.categoryId
      );
    }

    const recipeList: RecipeListItem[] = filteredRecipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      categoryId: recipe.categoryId,
      category: this.categoryService.getCategoryName(recipe.categoryId),
      difficulty: recipe.difficulty,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      image: recipe.image
    }));

    return {
      data: recipeList,
      total: recipeList.length
    };
  }

  public getRecipeById(id: number): RecipeDetailResponse | null {
    const recipe = this.recipes.find(recipe => recipe.id === id);
    
    if (!recipe) {
      return null;
    }

    return {
      data: recipe
    };
  }
}