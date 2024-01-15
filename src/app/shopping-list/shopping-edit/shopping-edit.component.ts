import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm:NgForm;

  subscription:Subscription;
  editMode:boolean = false;
  editableItemIndex:number;
  editableIngredient:Ingredient;
  deletingredientIndex:number;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService
      .startedEditin.subscribe((index:number)=> {
        this.editMode = true;
        this.editableItemIndex = index;
        this.deletingredientIndex = index;
        this.editableIngredient = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editableIngredient.name,
          amount: this.editableIngredient.amount
        });
      });
  }

  onAddUpdateItem(form:NgForm) {
    const values = form.value;
    const newIngredient = new Ingredient(values.name, values.amount);
    if(this.editMode) {
      this.slService.updateIngredients(this.editableItemIndex,newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editableItemIndex);
    this.deletingredientIndex = null;
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
