import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseRecipe } from '../core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card card-main h-100">
      <img *ngIf="!compact" [src]="recipe.strMealThumb" class="card-img-top" [alt]="recipe.strMeal">
      <div class="card-body text-center">
        <h6 *ngIf="compact" class="card-title mb-2 text-truncate">{{ recipe.strMeal }}</h6>
        <h5 *ngIf="!compact" class="card-title mb-3">{{ recipe.strMeal }}</h5>
        <a [routerLink]="['/recipe', recipe.idMeal]" class="btn btn-outline-main btn-sm me-2">
          Details
        </a>

        <button *ngIf="showRemoveButton"
                (click)="onRemove()"
                class="btn btn-outline-danger btn-sm">
          Remove
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card-main {
      border: none;
      border-radius: 1rem;
      box-shadow: 0 6px 18px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .card-main:hover {
      transform: translateY(-8px);
    }
    .card-img-top {
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      height: 200px;
      object-fit: cover;
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
    .btn-outline-danger {
      color: #A2342F;
      border: 2px solid #A2342F;
      border-radius: 0.5rem;
    }
    .btn-outline-danger:hover {
      background-color: #A2342F;
      color: #ffffff;
    }
    .small-card {
      max-width: 14rem;
    }
  `]
})
export class RecipeCardComponent {
  @Input() recipe!: BaseRecipe;
  @Input() compact = false;
  @Input() showRemoveButton = false;
  @Output() remove = new EventEmitter<string>();

  onRemove() {
    this.remove.emit(this.recipe.idMeal);
  }
}
