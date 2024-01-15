import { Component, OnDestroy, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipeSubscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private rout: ActivatedRoute
  ) {}

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
    this.recipeSubscription = this.recipeService.recipeListChange.subscribe(
      (allRecipes: Recipe[]) => {
        this.recipes = allRecipes;
      }
    );
  }

  onClickNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.rout });
  }

  ngOnDestroy() {
    this.recipeSubscription.unsubscribe();
  }
}
