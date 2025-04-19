import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../core/recipe.service'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../core/favorites.service';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule, RouterModule],
  template: `
<div class="container py-4" *ngIf="recipe(); else errorTpl">

  <!-- 🔲 ROW: immagine + info -->
  <div class="row mb-4 align-items-start">
    <!-- colonna immagine -->
    <div class="col-12 col-md-4 mb-3 mb-md-0">
      <img 
        [src]="recipe().strMealThumb"
        [alt]="recipe().strMeal"
        class="img-fluid rounded shadow"
      />
    </div>

    <!-- colonna testo a destra -->
    <div class="col-12 col-md-8">
      <h2 class="mb-3">{{ recipe().strMeal }}</h2>
      
      <!-- 🔙 BACK BUTTON -->
      <div class="mb-3">
        <a routerLink="/" class="btn btn-outline-secondary">
          ← Back to search
        </a>
      </div>

      <div class="row mb-3">
        <div>
          <strong>Category:</strong> {{ recipe().strCategory }}
        </div>
        <div>
          <strong>Area:</strong> {{ recipe().strArea }}
        </div>
      </div>

      <button 
        class="btn btn-warning me-2 mb-2"
        (click)="toggleFavorite()"
      >
        <span *ngIf="isFav(); else notFav">❤️ Remove from favorites</span>
        <ng-template #notFav>🤍 Add to favorites</ng-template>
      </button>

      <a 
        *ngIf="recipe().strYoutube" 
        [href]="recipe().strYoutube" 
        target="_blank" 
        class="btn btn-outline-danger mb-2"
      >
        ▶ Watch on YouTube
      </a>

    </div>
  </div>

  <!-- 🔸 INGREDIENTS -->
  <h4 class="mt-4">Ingredients</h4>
  <ul>
    <li *ngFor="let ing of getIngredients()">{{ ing }}</li>
  </ul>

  <!-- 🔸 INSTRUCTIONS -->
  <h4 class="mt-4">Instructions</h4>
  <p style="white-space: pre-line">{{ recipe().strInstructions }}</p>
</div>

<ng-template #errorTpl>
  <div class="alert alert-danger mt-4 text-center">
    {{ error() }}
    <br />
    <a routerLink="/" class="btn btn-outline-secondary mt-3">← Back to search</a>
  </div>
</ng-template>
  `,
  styles: ``
})
export class RecipeDetailComponent implements OnInit {
  recipe = signal<any | null>(null);
  error = signal<string | null>(null);
  isFav = signal(false);

  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);
  private favoritesService = inject(FavoritesService);


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getRecipeById(id).subscribe({
        next: (res) => {
          const found = res.meals?.[0];
          if (found) {
            this.recipe.set(found);
            this.isFav.set(this.favoritesService.isFavorite(found.idMeal));
          } else {
            this.error.set('Recipe not found.');
          }
        },
        error: () => this.error.set('Error retrieving data.')
      });
    } else {
      this.error.set('Invalid recipe ID.');
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