import { Component, inject, signal } from '@angular/core';
import { FavoritesService } from '../../core/services/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeCardComponent } from '../../shared/recipe-card.component';
import { SkeletonCardComponent } from '../../shared/skeleton-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, RecipeCardComponent, SkeletonCardComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  // Inject the FavoritesService to manage favorite recipes.
  private favoritesService = inject(FavoritesService);

  // Expose the favorites signal from the service to be used in the template.
  favorites = this.favoritesService.favorites;

  // Signal to track the loading state of the component.
  loading = signal(true);

  // Array of skeleton items used for loading placeholders.
  skeletonItems = [1, 2, 3, 4, 5, 6];

  constructor() {
    // Simulate a delay (800ms) to show loading skeleton, then disable loading.
    setTimeout(() => this.loading.set(false), 800);
  }

  // Method to remove a recipe from favorites by its id.
  remove(id: string) {
    this.favoritesService.remove(id);
  }
}
