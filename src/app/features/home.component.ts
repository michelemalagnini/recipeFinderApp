import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../core/recipe.service';
import { RouterModule, Router } from '@angular/router';
import { FavoritesService } from '../core/favorites.service';
import { NavbarComponent } from '../shared/navbar.component';
import { SearchFormComponent } from '../shared/search-form.component';
import { RecipeCardComponent } from '../shared/recipe-card.component';
import { Recipe, RecipeResponse } from '../core/recipe.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, SearchFormComponent, RecipeCardComponent],
  template: `
<div class="home-container py-5">
  <!-- NAVBAR -->
  <app-navbar></app-navbar>


  <!-- SEARCH FORM -->
  <app-search-form (searchSubmit)="search($event)"></app-search-form>


  <!-- ERROR / LOADING -->
  <div *ngIf="error()" class="alert alert-danger mx-auto w-50">{{ error() }}</div>
  <div *ngIf="loading()" class="text-muted text-center">Loading...</div>

  <!-- FAVORITES PREVIEW -->
  <section *ngIf="favoritesPreview().length" class="favorites-section mb-5 text-center">
    <h2 class="section-title">⭐ Your first 3 favorites</h2>
    <div class="row g-4 justify-content-center">
      <div class="col-auto" *ngFor="let r of favoritesPreview().slice(0,3)">
        <app-recipe-card [recipe]="r" [compact]="true"></app-recipe-card>
      </div>
    </div>
  </section>

  <!-- RECIPES GRID -->
  <section *ngIf="recipes().length" class="recipes-section text-center">
    <div class="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
      <div class="col" *ngFor="let r of recipes()">
        <app-recipe-card [recipe]="r" [compact]="false"></app-recipe-card>
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
  recipes = signal<Recipe[]>([]);
  error = signal<string | null>(null);

  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  favoritesPreview = this.favoritesService.favorites;

  search(query: string) {
    if (!query.trim()) {
      this.error.set('Enter an ingredient or keyword.');
      this.recipes.set([]);
      return;
    }
  
    this.error.set(null);
    this.loading.set(true);
  
    this.recipeService.searchRecipes(query).subscribe({
      next: (res: RecipeResponse) => {
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
