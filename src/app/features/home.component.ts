import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../core/recipe.service';
import { RouterModule, Router } from '@angular/router';
import { FavoritesService } from '../core/favorites.service';
import { NavbarComponent } from '../shared/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  template: `
<div class="home-container py-5">
  <!-- NAVBAR -->
  <app-navbar></app-navbar>


  <!-- SEARCH FORM -->
  <form (submit)="search(); $event.preventDefault()" class="search-form mb-5 text-center">
    <div class="input-group justify-content-center">
      <input
        [(ngModel)]="query"
        name="query"
        class="form-control input-main"
        placeholder="Search recipes..."
      >
      <button class="btn btn-main" type="submit">Search</button>
    </div>
  </form>

  <!-- ERROR / LOADING -->
  <div *ngIf="error()" class="alert alert-danger mx-auto w-50">{{ error() }}</div>
  <div *ngIf="loading()" class="text-muted text-center">Loading...</div>

  <!-- FAVORITES PREVIEW -->
  <section *ngIf="favoritesPreview().length" class="favorites-section mb-5 text-center">
    <h2 class="section-title">⭐ Your Favorites</h2>
    <div class="row g-4 justify-content-center">
      <div class="col-auto" *ngFor="let r of favoritesPreview().slice(0,3)">
        <div class="card card-main small-card h-100">
          <img [src]="r.strMealThumb" class="card-img-top" [alt]="r.strMeal">
          <div class="card-body p-3 text-center">
            <h6 class="card-title mb-2 text-truncate">{{ r.strMeal }}</h6>
            <a (click)="goToRecipe(r.idMeal)" class="btn btn-outline-main btn-sm w-100">
              Details
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- RECIPES GRID -->
  <section *ngIf="recipes().length" class="recipes-section text-center">
    <div class="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
      <div class="col" *ngFor="let r of recipes()">
        <div class="card card-main h-100">
          <img [src]="r.strMealThumb" class="card-img-top" [alt]="r.strMeal">
          <div class="card-body">
            <h5 class="card-title mb-3">{{ r.strMeal }}</h5>
            <a (click)="goToRecipe(r.idMeal)" class="btn btn-outline-main btn-sm">
              Details
            </a>
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
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  margin: 0 auto 2rem;
  gap: 2rem;
}
/* Media query: center nav items on mobile */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
}
.hero {
  font-size: 2.5rem;
  color: #D64541;
  margin: 0;
}
.btn-outline-main {
  color: #D64541;
  border-color: #D64541;
  border-radius: 0.5rem;
}
.btn-outline-main:hover {
  background-color: #D64541;
  color: #ffffff;
}
.search-form .input-group {
  max-width: 600px;
  margin: 0 auto;
}
.input-main {
  border: 2px solid #D64541;
  border-right: none;
  border-radius: 0.5rem 0 0 0.5rem;
}
.input-main:focus {
  box-shadow: none;
  border-color: #A2342F;
}
.btn-main {
  background-color: #D64541;
  border: none;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #ffffff;
}
.btn-main:hover {
  background-color: #A2342F;
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
.small-card {
  max-width: 14rem;
}
.card-img-top {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  height: 200px;
  object-fit: cover;
}
.section-title {
  font-size: 1.75rem;
  color: #4A90E2;
  margin-bottom: 1rem;
}
.alert {
  max-width: 400px;
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
