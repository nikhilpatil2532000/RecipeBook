import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthComponent } from "./auth/auth.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations:[
        AuthComponent,
    ],
    imports:[
        FormsModule,
        SharedModule,
        AuthRoutingModule
    ]
})
export class AuthModule {}