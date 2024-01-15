import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  private url: string =
    'https://ng-my-recipe-book-3a72e-default-rtdb.firebaseio.com';

  storeRecipes() {
    const recipes: Recipe[] = this.recipeService.getRecipes();
    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     return this.http.put(this.url + '/recipes.json', recipes, {
    //       params: new HttpParams().set('auth', user.token),
    //     });
    //   })
    // );
    return this.http.put(this.url + '/recipes.json', recipes);
  }

  fetchRecipes() {
    // This will be used in Interceptor
    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     return this.http.get<Recipe[]>(this.url + '/recipes.json', {
    //       params: new HttpParams().set('auth', user.token),
    //     });
    //   }),
    //   map((recipes) => {
    //     return recipes.map((recipe) => {
    //       recipe.ingredients = recipe.ingredients ? recipe.ingredients : [];
    //       return recipe;
    //     });
    //   }),
    //   tap((recipeList) => {
    //     this.recipeService.setRecipe(recipeList);
    //   })
    // );

    return this.http.get<Recipe[]>(this.url + '/recipes.json').pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          recipe.ingredients = recipe.ingredients ? recipe.ingredients : [];
          return recipe;
        });
      }),
      tap((recipeList) => {
        this.recipeService.setRecipe(recipeList);
      })
    );
  }
}
