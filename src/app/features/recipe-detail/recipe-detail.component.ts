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
  template: `
<!-- LOADING SKELETON -->
<ng-container *ngIf="loading(); else contentTpl">
  <app-skeleton-recipe-detail></app-skeleton-recipe-detail>
</ng-container>

<ng-template #contentTpl>
  <!-- MAIN CONTENT -->
  <div class="detail-container py-5" *ngIf="recipe(); else errorTpl">
    <!-- BACK BUTTON -->
    <div class="mb-4 text-center text-md-start">
      <a routerLink="/" class="btn btn-outline-main">← Back to search</a>
    </div>

    <!-- IMAGE + INFO -->
    <div class="row align-items-start mb-5">
      <div class="col-12 col-md-4 mb-4 mb-md-0 text-center">
        <img
          [src]="recipe()?.strMealThumb"
          [alt]="recipe()?.strMeal"
          class="img-fluid detail-img"
        />
      </div>
      <div class="col-12 col-md-8">
        <h2 class="detail-title mb-3">{{ recipe()?.strMeal }}</h2>

        <div class="info-tags mb-4">
          <span class="tag"><strong>Category:</strong> {{ recipe()?.strCategory }}</span>
          <span class="tag"><strong>Area:</strong> {{ recipe()?.strArea }}
            <img
              *ngIf="flagUrl()"
              [src]="flagUrl()"
              [alt]="recipe()?.strArea + ' flag'"
              class="flag-icon ms-2"
            />
          </span>
        </div>

        <button class="btn btn-main me-3 mb-3" (click)="toggleFavorite()">
          <ng-container *ngIf="isFav(); else notFav">
            ❤️ Remove from favorites
          </ng-container>
          <ng-template #notFav>🤍 Add to favorites</ng-template>
        </button>

        <a
          *ngIf="recipe()?.strYoutube"
          [href]="recipe()?.strYoutube"
          target="_blank"
          class="btn btn-outline-main mb-3"
        >
          ▶ Watch on YouTube
        </a>
      </div>
    </div>

    <!-- INGREDIENTS -->
    <section class="mb-5">
      <h4 class="section-title">Ingredients</h4>
      <ul class="list-unstyled ingredients-list">
        <li *ngFor="let ing of getIngredients()">{{ ing }}</li>
      </ul>
    </section>

    <!-- INSTRUCTIONS -->
    <section>
      <h4 class="section-title">Instructions</h4>
      <p class="instructions" style="white-space: pre-line">
        {{ recipe()?.strInstructions }}
      </p>
    </section>
  </div>

  <!-- ERROR STATE -->
  <ng-template #errorTpl>
    <div class="alert alert-danger mt-4 text-center">
      {{ error() }}
      <br />
      <a routerLink="/" class="btn btn-outline-main mt-3">← Back to search</a>
    </div>
  </ng-template>
</ng-template>
  `,
  styles: [`
:host {
  display: block;
  background-color: #ffffff;
  color: #222222;
  font-family: 'Montserrat', sans-serif;
}
.detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
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
.btn-main {
  background-color: #D64541;
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
}
.btn-main:hover {
  background-color: #A2342F;
}
.detail-img {
  border-radius: 1rem;
  max-width: 100%;
  height: auto;
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
}
.detail-title {
  font-size: 2rem;
  color: #D64541;
  margin: 0;
}
.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.tag {
  background-color: #4A90E2;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}
.section-title {
  font-size: 1.75rem;
  color: #4A90E2;
  margin-bottom: 1rem;
}
.ingredients-list li {
  margin-bottom: 0.5rem;
}
.instructions {
  line-height: 1.6;
}
@media (max-width: 768px) {
  .info-tags {
    justify-content: center;
  }
  .detail-container .row {
    text-align: center;
  }
}
.flag-icon {
  width: 24px;
  height: auto;
  vertical-align: middle;
  border-radius: 0.2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
`]
})
export class RecipeDetailComponent implements OnInit {
  recipe = signal<Recipe | null>(null);
  error = signal<string | null>(null);
  isFav = signal(false);
  flagUrl = signal<string>('');
  loading = signal(true);

  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);
  private favoritesService = inject(FavoritesService);
  private flagService = inject(FlagService);
  private destroyRef = inject(DestroyRef);


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading.set(true);
      this.recipeService.getRecipeById(id).pipe(
        switchMap((res: RecipeResponse) => {
          const found = res.meals?.[0];
          if (found) {
            this.recipe.set(found);
            this.isFav.set(this.favoritesService.isFavorite(found.idMeal));
            // Chain the flag API call using switchMap to avoid nested subscriptions
            return this.flagService.getFlagByArea(found.strArea ?? '');
          } else {
            return throwError(() => new Error('Recipe not found.'));
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (url: string) => {
          this.flagUrl.set(url);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Error retrieving data.');
          this.loading.set(false);
        }
      });
    } else {
      this.error.set('Invalid recipe ID.');
      this.loading.set(false);
    }
  }

  getIngredients(): string[] {
    const r = this.recipe();
    if (!r) return [];
    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = r[`strIngredient${i}`];
      const measure = r[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }
    return ingredients;
  }

  toggleFavorite() {
    const r = this.recipe();
    if (!r) return;

    if (this.isFav()) {
      this.favoritesService.remove(r.idMeal);
      this.isFav.set(false);
    } else {
      this.favoritesService.add(r);
      this.isFav.set(true);
    }
  }
}
