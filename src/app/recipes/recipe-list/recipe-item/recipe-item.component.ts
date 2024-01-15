import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit, OnDestroy {
  @Input() recipe: Recipe;
  @Input() index: number;

  constructor(private recipeService: RecipeService) { }
  
  ngOnInit() {
  }

  onSelected() {
    this.recipeService.recipeSelected.next(this.recipe);
  }

  ngOnDestroy(){
    
  }

}
