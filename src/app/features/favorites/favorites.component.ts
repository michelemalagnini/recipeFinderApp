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
  private favoritesService = inject(FavoritesService);
  favorites = this.favoritesService.favorites;
  loading = signal(true);
  skeletonItems = [1,2,3,4,5,6]

  constructor() {
    setTimeout(() => this.loading.set(false), 800);
  }


  remove(id: string) {
    this.favoritesService.remove(id);
  }
}
