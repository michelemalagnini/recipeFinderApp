import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { RecipeService } from '../../core/services/recipe.service';
import { FavoritesService } from '../../core/services/favorites.service';

import { NavbarComponent } from '../../shared/navbar.component';
import { SearchFormComponent } from '../../shared/search-form.component';
import { RecipeCardComponent } from '../../shared/recipe-card.component';
import { SkeletonCardComponent } from '../../shared/skeleton-card.component';

import { Recipe, RecipeResponse } from '../../core/models/recipe.model';

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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  query = signal('');
  loading = signal(false);
  recipes = signal<Recipe[]>([]);
  error = signal<string | null>(null);
  isDefaultSearch = signal(false);
  skeletonItems = [1,2,3,4,5,6]

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
