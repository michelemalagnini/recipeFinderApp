import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../core/recipe.service';
import { RouterModule, Router } from '@angular/router';
import { FavoritesService } from '../core/favorites.service';


@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1>🔍 Find a recipe</h1>
        <a routerLink="/favorites" class="btn btn-outline-secondary">❤️ Go to favorites</a>
      </div>

      <form (submit)="search(); $event.preventDefault()" class="input-group mb-3">
        <input [(ngModel)]="query" name="query" class="form-control" placeholder="Ex. chicken, pasta, curry...">
        <button class="btn btn-primary" type="submit">Search</button>
      </form>

      <div *ngIf="error()" class="alert alert-danger">{{ error() }}</div>
      <div *ngIf="loading()" class="text-muted">Loading...</div>


      <div *ngIf="favoritesPreview().length > 0" class="mb-4">
        <h5 class="mb-2">⭐ Your first 3 favorites recipes to see more go to Favorites page</h5>
        <div class="row g-2 justify-content-start">
          <div class="col-auto" *ngFor="let r of favoritesPreview().slice(0,3)">
            <div class="card h-100 small-card">
              <img [src]="r.strMealThumb" class="card-img-top" [alt]="r.strMeal">
              <div class="card-body p-2">
                <h6 class="card-title mb-1 text-truncate">{{ r.strMeal }}</h6>
                <a (click)="goToRecipe(r.idMeal)" class="btn btn-sm btn-outline-primary w-100">Details</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row row-cols-1 row-cols-md-3 g-4 mt-2">
        <div class="col" *ngFor="let r of recipes()">
          <div class="card h-100">
            <img [src]="r.strMealThumb" class="card-img-top" [alt]="r.strMeal">
            <div class="card-body">
              <h5 class="card-title">{{ r.strMeal }}</h5>
              <a (click)="goToRecipe(r.idMeal)" class="btn btn-outline-primary btn-sm">Details</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
     styles: [`
    .small-card {
      max-width: 12rem;    /* mantiene la dimensione ridotta */
      margin: 0;           /* niente centering orizzontale */
    }
    .small-card .card-img-top {
      height: 8rem;
      object-fit: cover;
    }
    .small-card .card-body {
      padding: 0.5rem;
    }
    .small-card .card-title {
      font-size: 0.9rem;
    }
    .small-card .btn-sm {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
  `]
})
export class HomeComponent {
  query = '';
  loading = signal(false);
  recipes = signal<any[]>([]);
  error = signal<string | null>(null);

  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  favoritesPreview = this.favoritesService.favorites;

  search() {
    if (!this.query.trim()) {
      this.error.set('Enter an ingredient or keyword.');
      this.recipes.set([]);
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    this.recipeService.searchRecipes(this.query.trim()).subscribe({
      next: (res) => {
        this.recipes.set(res.meals || []);
        if (!res.meals) this.error.set('No recipe found.');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Search error. Please try again.');
        this.loading.set(false);
      }
    });
  }

  goToRecipe(idMeal: string) {
    this.router.navigate(['/recipe', idMeal]);
  }
}
