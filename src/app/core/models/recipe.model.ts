export interface BaseRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface Recipe extends BaseRecipe {
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strTags?: string;
  strYoutube?: string;
  // qualsiasi altro campo opzionale:
  [key: string]: any;
}

export interface RecipeResponse {
  meals: Recipe[] | null;
}