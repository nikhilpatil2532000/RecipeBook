import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-recipes-edit',
  templateUrl: './recipes-edit.component.html',
  styleUrl: './recipes-edit.component.css',
})
export class RecipesEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(
    private rout: ActivatedRoute, 
    private rpService: RecipeService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.rout.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let name = '';
    let description = '';
    let imageUrl = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      const recipe = this.rpService.getRecipe(this.id);
      name = recipe.name;
      description = recipe.description;
      imageUrl = recipe.imagePath;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern('^[1-9]+[0-9]*$'),
              ]),
            })
          );
        }
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      description: new FormControl(description, Validators.required),
      imagePath: new FormControl(imageUrl, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  onSubmit() {
    console.log(this.recipeForm);
    this.onCancel();
  }

  getIngredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  addIngredients() {
    let ingredient = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
    (<FormArray>this.recipeForm.get('ingredients')).push(ingredient);
  }

  addOrUpdateRecipe() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients'],
    // );
    const newRecipe = <Recipe>this.recipeForm.value;
    if (this.editMode) {
      this.rpService.updateRecipe(this.id, newRecipe);
    } else {
      this.rpService.addRecipe(newRecipe);
    }
  }

  onCancel() {
    this.router.navigate(['../'],{relativeTo:this.rout});
  }

  onDeleteIngredient(index:number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
