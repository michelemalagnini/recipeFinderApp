import { Component, inject } from '@angular/core';
import { FavoritesService } from '../core/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="mb-3">
        <a routerLink="/" class="btn btn-outline-secondary">
          ← Back to search
        </a>
      </div>
      <h2 class="mb-4">❤️ My favorite recipes</h2>

      <div *ngIf="favorites().length === 0" class="alert alert-info">
        No saved recipes.
        <a routerLink="/" class="btn btn-sm btn-outline-primary ms-2">Search for a recipe</a>
      </div>

      <div class="row row-cols-1 row-cols-md-3 g-4 mt-2" *ngIf="favorites().length > 0">
        <div class="col" *ngFor="let r of favorites()">
          <div class="card h-100">
            <img [src]="r.strMealThumb" class="card-img-top" [alt]="r.strMeal">
            <div class="card-body">
              <h5 class="card-title">{{ r.strMeal }}</h5>
              <a [routerLink]="['/recipe', r.idMeal]" class="btn btn-outline-primary btn-sm me-2">Details</a>
              <button (click)="remove(r.idMeal)" class="btn btn-outline-danger btn-sm">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  
  favorites = this.favoritesService.favorites;

  remove(id: string) {
    this.favoritesService.remove(id);
  }

}
