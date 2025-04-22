import { Injectable, signal, computed } from '@angular/core';
import { BaseRecipe } from '../models/recipe.model';


@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private storageKey = 'favorite_recipes';

  // Initialize reactive signal with stored favorites
  private favoritesSignal = signal<BaseRecipe[]>(this.loadFavorites());

  // Public computed properties that update when favoritesSignal changes
  readonly favorites = computed(() => this.favoritesSignal());
  readonly favoritesCount = computed(() => this.favoritesSignal().length);

  // Attempt to load favorites from localStorage
  // If no data is found or an error occurs, returns an empty array
  private loadFavorites(): BaseRecipe[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Favorites parsing failed, clearing storage');
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  // Updates localStorage and the reactive signal with the new favorites list
  private updateStorage(data: BaseRecipe[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.favoritesSignal.set(data);
  }

  // Adds a recipe to favorites if it is not already present
  add(recipe: BaseRecipe) {
    if (!this.isFavorite(recipe.idMeal)) {
      const updated = [...this.favoritesSignal(), recipe];
      this.updateStorage(updated);
    }
  }

  // Removes a recipe from favorites using its id
  remove(id: string) {
    const updated = this.favoritesSignal().filter(r => r.idMeal !== id);
    this.updateStorage(updated);
  }

  // Toggles a recipe: add it if not favorite, remove it if it is favorite
  toggle(recipe: BaseRecipe) {
    this.isFavorite(recipe.idMeal)
      ? this.remove(recipe.idMeal)
      : this.add(recipe);
  }

  // Checks if a recipe with the provided id is in favorites
  isFavorite(id: string): boolean {
    return this.favoritesSignal().some(r => r.idMeal === id);
  }
}
