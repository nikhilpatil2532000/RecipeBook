import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { RecipesComponent } from './recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeResolverService } from './recipe-resolver.service';
import { RecipesEditComponent } from './recipes-edit/recipes-edit.component';
import { RecipesStartComponent } from './recipes-start/recipes-start.component';

const recipeRouts: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', component: RecipesStartComponent },
      { path: 'new', component: RecipesEditComponent },
      // when ever this rout get loaded , resolve method will get executed
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: { resolvedData: RecipeResolverService },
      },
      {
        path: ':id/edit',
        component: RecipesEditComponent,
        resolve: { resolvedData: RecipeResolverService },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(recipeRouts)],
  exports: [RouterModule],
})
export class RecipeRoutingModule {}
