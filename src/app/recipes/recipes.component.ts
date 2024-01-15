import { Component, OnInit } from '@angular/core';
import { RecipeResolverService } from './recipe-resolver.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeResolverService]
})
export class RecipesComponent implements OnInit {
  ngOnInit() {}
}
