import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRountingModule } from './app-routing.module';
//import { RecipesModule } from './recipes/recipe.module';
//import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
//import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRountingModule,
    HttpClientModule,
    //RecipesModule,
    //ShoppingListModule,
    SharedModule,
    CoreModule,
    //AuthModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
