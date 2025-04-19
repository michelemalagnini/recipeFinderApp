import { Component, inject, signal } from '@angular/core';
import { FavoritesService } from '../core/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<div class="favorites-container py-5">
  <!-- BACK BUTTON -->
  <div class="text-center text-md-start mb-4">
    <a routerLink="/" class="btn btn-outline-main">
      ← Back to search
    </a>
  </div>

  <!-- PAGE TITLE -->
  <h2 class="page-title mb-4">❤️ My Favorites</h2>

  <!-- EMPTY STATE -->
  <div *ngIf="favorites().length === 0" class="alert alert-info mx-auto w-50 text-center">
    No saved recipes.
    <a routerLink="/" class="btn btn-sm btn-outline-main ms-2">Search for a recipe</a>
  </div>

  <!-- FAVORITES GRID -->
  <section *ngIf="favorites().length > 0" class="favorites-section">
    <div class="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
      <div class="col" *ngFor="let r of favorites()">
        <div class="card card-main h-100">
          <img [src]="r.strMealThumb" class="card-img-top" [alt]="r.strMeal" />
          <div class="card-body text-center">
            <h5 class="card-title mb-3">{{ r.strMeal }}</h5>
            <a [routerLink]="['/recipe', r.idMeal]" class="btn btn-outline-main btn-sm me-2">
              Details
            </a>
            <button (click)="remove(r.idMeal)" class="btn btn-outline-danger btn-sm">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
  `,
  styles: [`
:host {
  display: block;
  background-color: #ffffff;
  color: #222222;
  font-family: 'Montserrat', sans-serif;
}
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}
.page-title {
  font-size: 2rem;
  color: #D64541;
  margin: 0;
}
.btn-outline-main {
  color: #D64541;
  border: 2px solid #D64541;
  border-radius: 0.5rem;
}
.btn-outline-main:hover {
  background-color: #D64541;
  color: #ffffff;
}
.btn-outline-danger {
  color: #A2342F;
  border: 2px solid #A2342F;
  border-radius: 0.5rem;
}
.btn-outline-danger:hover {
  background-color: #A2342F;
  color: #ffffff;
}
.card-main {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.card-main:hover {
  transform: translateY(-8px);
}
.card-img-top {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  height: 200px;
  object-fit: cover;
}
@media (max-width: 768px) {
  .favorites-section .row {
    justify-content: center;
  }
}
`]
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  favorites = this.favoritesService.favorites;

  remove(id: string) {
    this.favoritesService.remove(id);
  }
}
