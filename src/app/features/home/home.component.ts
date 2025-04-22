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

// Constant key used for storing the last search result in localStorage.
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
   // Signal for the search query
   query = signal('');
   // Signal for tracking loading state
   loading = signal(false);
   // Signal to hold the array of recipes
   recipes = signal<Recipe[]>([]);
   // Signal to hold an error message, if any
   error = signal<string | null>(null);
   // Signal to track if the current search is the default search on init
   isDefaultSearch = signal(false);
   // Array for skeleton (loading) placeholders
   skeletonItems = [1,2,3,4,5,6];

  // Injecting required services and router.
  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);
  private destroyRef = inject(DestroyRef);

  // Exposing favorites from the favorites service to be used in the template.
  favoritesPreview = this.favoritesService.favorites;

  ngOnInit(): void {
    // Retrieve the last stored search from localStorage.
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // Parse the JSON string.
      const { query, results } = JSON.parse(stored);
      if (results && results.length > 0) {
        // Restore query and recipes if data exists.
        this.query.set(query);
        this.recipes.set(results);
        this.isDefaultSearch.set(false);
        return;
      }
    }
    // If no stored valid search, perform a default search with 'pork' to show the user how does it work the app.
    this.search('pork');
    this.isDefaultSearch.set(true);
  }

  // Method to perform a recipe search based on the provided query.
  search(query: string) {
    // Trim the query string.
    const trimmed = query.trim();
    if (!trimmed) {
      // If trimmed query is empty, display an error and clear the recipe list.
      this.error.set('Enter an ingredient or keyword.');
      this.recipes.set([]);
      return;
    }
    // Update query signal and clear any previous error.
    this.query.set(trimmed);
    this.error.set(null);
    // Set loading indicator to true.
    this.loading.set(true);
    // Mark this as not the default search.
    this.isDefaultSearch.set(false);
    // Call the recipe service to search for recipes.
    this.recipeService.searchRecipes(trimmed).pipe(
      // Ensure the subscription is cancelled when the component is destroyed.
      takeUntilDestroyed(this.destroyRef) 
    ).subscribe({
      next: (res: RecipeResponse) => {
        // Get the list of recipes from the response or empty array.
        const result = res.meals || [];
        // Update the recipes signal.
        this.recipes.set(result);
        if (!res.meals) {
          // If no recipes are found, set an error message.
          this.error.set('No recipe found.');
        } else {
          // If recipes are found, store the query and results in localStorage.
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            query: trimmed,
            results: result
          }));
        }
        // Turn off the loading indicator.
        this.loading.set(false);
      },
      error: () => {
        // In case of an API error, set error message and stop loading.
        this.error.set('Search error. Please try again.');
        this.loading.set(false);
      }
    });
  }

  // Navigate to a detailed recipe view based on the recipe's id.
  goToRecipe(idMeal: string) {
    this.router.navigate(['/recipe', idMeal]);
  }

  // Determines if a default message should be shown; true if default search is active and there’s no error.
  showDefaultMessage(): boolean {
    return this.isDefaultSearch() && !this.error();
  }
}
