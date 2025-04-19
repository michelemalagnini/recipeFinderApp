import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  
  private storageKey = 'favorite_recipes';

  private favoritesSignal = signal<any[]>(this.loadFavorites());

  readonly favorites = computed(() => this.favoritesSignal());

  private loadFavorites(): any[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private updateStorage(data: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.favoritesSignal.set(data);
  }

  add(recipe: any) {
    if (!this.isFavorite(recipe.idMeal)) {
      const updated = [...this.favoritesSignal(), recipe];
      this.updateStorage(updated);
    }
  }

  remove(id: string) {
    const updated = this.favoritesSignal().filter(r => r.idMeal !== id);
    this.updateStorage(updated);
  }

  isFavorite(id: string): boolean {
    return this.favoritesSignal().some(r => r.idMeal === id);
  }
}

