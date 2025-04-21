import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { RecipeService } from '../core/recipe.service';
import { FavoritesService } from '../core/favorites.service';

import { NavbarComponent } from '../shared/navbar.component';
import { SearchFormComponent } from '../shared/search-form.component';
import { RecipeCardComponent } from '../shared/recipe-card.component';
import { SkeletonCardComponent } from '../shared/skeleton-card.component';

import { Recipe, RecipeResponse } from '../core/recipe.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


const STORAGE_KEY = 'last_search';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    SearchFormComponent,
    RecipeCardComponent,
    SkeletonCardComponent
  ],
  template: `
<div class="home-container py-5">
  <!-- NAVBAR -->
  <app-navbar></app-navbar>

  <!-- SEARCH FORM -->
  <app-search-form (searchSubmit)="search($event)"></app-search-form>

  <!-- SEARCH CONTEXT MESSAGE -->
  <p class="text-muted text-center mb-3" *ngIf="recipes().length && query()">
    <ng-container *ngIf="isDefaultSearch(); else customSearch">
      Showing results for <strong>“pork”</strong> to get you started!
    </ng-container>
    <ng-template #customSearch>
      🔎 Showing results for <strong>“{{ query() }}”</strong>
    </ng-template>
  </p>

  <!-- ERROR -->
  <div *ngIf="error()" class="alert alert-danger mx-auto w-50">{{ error() }}</div>

  <!-- LOADING SKELETON -->
  <section *ngIf="loading()" class="recipes-section text-center">
    <div class="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
      <div class="col" *ngFor="let i of [1,2,3,4,5,6]">
        <app-skeleton-card></app-skeleton-card>
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
  query = signal('');
  loading = signal(false);
  recipes = signal<Recipe[]>([]);
  error = signal<string | null>(null);
  isDefaultSearch = signal(false);

  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);
  private destroyRef = inject(DestroyRef);

  favoritesPreview = this.favoritesService.favorites;

  ngOnInit(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { query, results } = JSON.parse(stored);
      if (results && results.length > 0) {
        this.query.set(query);
        this.recipes.set(results);
        this.isDefaultSearch.set(false);
        return;
      }
    }

    this.search('pork');
    this.isDefaultSearch.set(true);
  }

  search(query: string) {
    const trimmed = query.trim();
    if (!trimmed) {
      this.error.set('Enter an ingredient or keyword.');
      this.recipes.set([]);
      return;
    }
    this.query.set(trimmed);
    this.error.set(null);
    this.loading.set(true);
    this.isDefaultSearch.set(false);
    this.recipeService.searchRecipes(trimmed).pipe(
      takeUntilDestroyed(this.destroyRef) 
    ).subscribe({
      next: (res: RecipeResponse) => {
        const result = res.meals || [];
        this.recipes.set(result);
        if (!res.meals) {
          this.error.set('No recipe found.');
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            query: trimmed,
            results: result
          }));
        }
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

  showDefaultMessage(): boolean {
    return this.isDefaultSearch() && !this.error();
  }
}
