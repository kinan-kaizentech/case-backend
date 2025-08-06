import { Category } from '../types';
import categories from '../data/categories.json';

export class CategoryService {
  private categories: Category[] = categories as Category[];

  public getCategories(): Category[] {
    return this.categories;
  }

  private getCategoryById(id: string): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  public getCategoryName(id: string): string {
    const category = this.getCategoryById(id);
    return category ? category.name : 'Bilinmeyen Kategori';
  }
}