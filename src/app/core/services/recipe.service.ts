import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RecipeDetailDto, RecipeResponse } from '../models/recipe.model';
import { RecipeDetailMapper } from '../recipe-detail.mapper';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/';
  private http = inject(HttpClient);

  searchRecipes(query: string): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>(`${this.apiUrl}search.php?s=${query}`);
  }

  getRecipeById(id: string): Observable<RecipeDetailDto> {
    return this.http
      .get<RecipeResponse>(`${this.apiUrl}lookup.php?i=${id}`)
      .pipe(
        map(res => {
          const raw = res.meals?.[0];
          const isArray = Array.isArray(raw);
          if (!raw || !isArray) throw new Error('Recipe not found');
          return RecipeDetailMapper.toDto(raw);
        })
      );
  }
}