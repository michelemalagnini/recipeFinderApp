import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../core/services/recipe.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { SkeletonRecipeDetailComponent } from '../../shared/skeleton-recipe-detail.component';
import { Recipe, RecipeResponse } from '../../core/models/recipe.model';
import { FlagService } from '../../core/services/coreFlag.service';
import { switchMap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonRecipeDetailComponent],
 templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  // Signal holding the current recipe; initially null.
  recipe = signal<Recipe | null>(null);
  // Signal holding any error message.
  error = signal<string | null>(null);
  // Signal representing whether the recipe is marked as a favorite.
  isFav = signal(false);
  // Signal holding the URL of the flag image corresponding to the recipe's area.
  flagUrl = signal<string>('');
  // Signal representing the loading state of the component.
  loading = signal(true);

  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);
  private favoritesService = inject(FavoritesService);
  private flagService = inject(FlagService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Retrieve the 'id' parameter from the URL.
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { // If an 'id' exists.
      // Set loading state to true.
      this.loading.set(true);
      // Fetch recipe details by id.
      this.recipeService.getRecipeById(id).pipe(
        // Use switchMap to chain the flag API call after retrieving the recipe.
        switchMap((res: RecipeResponse) => {
          // Retrieve the first meal from the response.
          const found = res.meals?.[0];
          if (found) {
            // Store the retrieved recipe.
            this.recipe.set(found);
            // Check if the recipe is already a favorite.
            this.isFav.set(this.favoritesService.isFavorite(found.idMeal));
            // Return the Observable from flagService based on the recipe's area.
            return this.flagService.getFlagByArea(found.strArea ?? '');
          } else {
            // If recipe is not found, throw an error.
            return throwError(() => new Error('Recipe not found.'));
          }
        }),
        // Automatically unsubscribe when the component is destroyed.
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (url: string) => {
          // When flag URL is received, set flagUrl signal.
          this.flagUrl.set(url);
          // Set loading to false since data is loaded.
          this.loading.set(false);
        },
        error: (err) => {
          // On error, set the error message signal.
          this.error.set(err.message || 'Error retrieving data.');
          // Turn off loading indicator.
          this.loading.set(false);
        }
      });
    } else {
      // If no valid recipe ID is found in the URL, set error message.
      this.error.set('Invalid recipe ID.');
      // Turn off loading indicator.
      this.loading.set(false);
    }
  }

  // Method to extract the list of ingredients with corresponding measures from the recipe.
  getIngredients(): string[] {
    const r = this.recipe();
    if (!r) return []; // Return empty array if no recipe exists.
    const ingredients: string[] = [];

    // Loop through possible ingredient numbers, assuming up to 20 ingredients.
    for (let i = 1; i <= 20; i++) {
      // Access the ingredient and its measure dynamically.
      const ingredient = r[`strIngredient${i}`];
      const measure = r[`strMeasure${i}`];
      // If ingredient exists and is not empty, add it to the list.
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }
    return ingredients;
  }

  // Method to toggle the favorite state of the recipe.
  toggleFavorite() {
    const r = this.recipe();
    if (!r) return; // Exit if there's no recipe loaded.

    if (this.isFav()) {
      // If the recipe is already a favorite, remove it from favorites.
      this.favoritesService.remove(r.idMeal);
      this.isFav.set(false);
    } else {
      // Otherwise, add it to favorites.
      this.favoritesService.add(r);
      this.isFav.set(true);
    }
  }
}