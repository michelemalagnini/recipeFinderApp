// src/app/core/mappers/recipe-detail.mapper.ts

import { Recipe, RecipeDetailDto } from "./models/recipe.model";


export class RecipeDetailMapper {
/**
 * Takes a raw Recipe (with strIngredient1…strIngredient20, strMeasure1…strMeasure20)
 * and returns a RecipeDetailDto with .ingredients = [ "Ingredient – Measure", … ].
 */
  static toDto(raw: Recipe): RecipeDetailDto {
    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingKey = `strIngredient${i}` as keyof Recipe;
      const measKey = `strMeasure${i}` as keyof Recipe;
      const ing = (raw[ingKey] as string)?.trim();
      const meas = (raw[measKey] as string)?.trim();
      if (ing) {
        ingredients.push(`${ing} – ${meas || ''}`.trim());
      }
    }

    return {
      ...raw,
      ingredients,
    };
  }
}
