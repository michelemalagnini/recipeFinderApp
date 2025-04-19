import { Routes } from '@angular/router';

export const routeConfig: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'recipe/:id',
    loadComponent: () => import('./features/recipe-detail.component').then(m => m.RecipeDetailComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites.component').then(m => m.FavoritesComponent)
  }
];
