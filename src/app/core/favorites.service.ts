import { Injectable, signal, computed } from '@angular/core';
import { BaseRecipe } from './models/recipe.model';


@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private storageKey = 'favorite_recipes';

  // Signal state tipizzato
  private favoritesSignal = signal<BaseRecipe[]>(this.loadFavorites());

  // API pubblica reactive
  readonly favorites = computed(() => this.favoritesSignal());
  readonly favoritesCount = computed(() => this.favoritesSignal().length);

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

  private updateStorage(data: BaseRecipe[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.favoritesSignal.set(data);
  }

  add(recipe: BaseRecipe) {
    if (!this.isFavorite(recipe.idMeal)) {
      const updated = [...this.favoritesSignal(), recipe];
      this.updateStorage(updated);
    }
  }

  remove(id: string) {
    const updated = this.favoritesSignal().filter(r => r.idMeal !== id);
    this.updateStorage(updated);
  }

  toggle(recipe: BaseRecipe) {
    this.isFavorite(recipe.idMeal)
      ? this.remove(recipe.idMeal)
      : this.add(recipe);
  }

  isFavorite(id: string): boolean {
    return this.favoritesSignal().some(r => r.idMeal === id);
  }
}
