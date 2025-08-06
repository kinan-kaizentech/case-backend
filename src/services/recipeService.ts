import { Recipe, RecipeListItem, RecipeFilters } from '../types';
import { CategoryService } from './categoryService';
import recipes from '../data/recipes.json';

export class RecipeService {
  private recipes: Recipe[] = recipes as Recipe[];
  private categoryService: CategoryService = new CategoryService();

  public getRecipes(filters?: RecipeFilters): RecipeListItem[] {
    let filteredRecipes = this.recipes;

    // Apply filters
    if (filters?.categoryId) {
      filteredRecipes = filteredRecipes.filter(
        recipe => recipe.categoryId === filters.categoryId
      );
    }

    if (filters?.keyword) {
      const searchTerm = filters.keyword.toLowerCase();
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm)
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

    return recipeList;
  }

  public getRecipeById(id: number): Recipe | null {
    const recipe = this.recipes.find(recipe => recipe.id === id);
    
    if (!recipe) {
      return null;
    }

    return recipe;
  }
}