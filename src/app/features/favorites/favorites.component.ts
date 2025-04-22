import { Component, computed, inject, signal } from '@angular/core';
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

  // Per la modale di conferma:
  // selectedId tiene traccia di quale recipe stiamo per cancellare
  selectedId = signal<string | null>(null);
  isModalOpen = computed(() => this.selectedId() !== null);

  constructor() {
    // Simulate a delay (800ms) to show loading skeleton, then disable loading.
    setTimeout(() => this.loading.set(false), 800);
  }

  // Click on the "remove" button in the card
   onRemoveClick(id: string) {
    this.selectedId.set(id);
  }

  // Confirm modal
  confirmRemove() {
    const id = this.selectedId();
    if (id) {
      this.favoritesService.remove(id);
    }
    this.selectedId.set(null);
  }

  // Cancel in the modal
  cancelRemove() {
    this.selectedId.set(null);
  }
}
