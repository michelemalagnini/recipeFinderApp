import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeResponse } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/';
  private http = inject(HttpClient);

  searchRecipes(query: string): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>(`${this.apiUrl}search.php?s=${query}`);
  }

  getRecipeById(id: string): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>(`${this.apiUrl}lookup.php?i=${id}`);
  }
}