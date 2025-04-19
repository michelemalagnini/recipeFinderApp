import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/';

  private http = inject(HttpClient);

  searchRecipes(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}search.php?s=${query}`);
  }

  getRecipeById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}lookup.php?i=${id}`);
  }
}