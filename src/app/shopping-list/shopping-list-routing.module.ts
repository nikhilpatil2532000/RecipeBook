import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';

const shoppingListRouts: Routes = [
    { path: '', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(shoppingListRouts)],
  exports: [RouterModule],
})
export class shoppingListRoutingModule {}
