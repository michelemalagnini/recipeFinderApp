import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../core/services/recipe.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { SkeletonRecipeDetailComponent } from '../../shared/skeleton-recipe-detail.component';
import { FlagService } from '../../core/services/coreFlag.service';
import { switchMap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RecipeDetailDto } from 'src/app/core/models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonRecipeDetailComponent],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  // Signal holding the current recipe; now RecipeDetailDto with ingredients[].
  recipe = signal<RecipeDetailDto | null>(null);
  // Signal holding any error message.
  error = signal<string | null>(null);
  // Signal representing whether the recipe is marked as a favorite.
  isFav = signal(false);
  // Signal holding the URL of the flag image corresponding to the recipe's area.
  flagUrl = signal<string>('');
  // Signal representing the loading state of the component.
  loading = signal(true);

  private recipeService    = inject(RecipeService);
  private route            = inject(ActivatedRoute);
  private favoritesService = inject(FavoritesService);
  private flagService      = inject(FlagService);
  private destroyRef       = inject(DestroyRef);

  ngOnInit(): void {
    // Retrieve the 'id' parameter from the URL.
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { // If an 'id' exists.
      // Set loading state to true.
      this.loading.set(true);
      // Fetch recipe details by id.
      this.recipeService.getRecipeById(id).pipe(
        // Use switchMap to chain the flag API call after retrieving the recipe.
        switchMap((dto: RecipeDetailDto) => {
          // Store the mapped DTO (con ingredients già pronto).
          this.recipe.set(dto);
          // Check if the recipe is already a favorite.
          this.isFav.set(this.favoritesService.isFavorite(dto.idMeal));
          // Return the Observable from flagService based on the recipe's area.
          return this.flagService.getFlagByArea(dto.strArea ?? '');
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
