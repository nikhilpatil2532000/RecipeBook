import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, Subscribable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { PlaceholderDirective } from '../../shared/Helpers/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  authObs: Observable<AuthResponseData>;
  @ViewChild(PlaceholderDirective) alertHost:PlaceholderDirective;
  closeSub:Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnDestroy(): void {
    if(!!this.closeSub) this.closeSub.unsubscribe();
  }

  onSubmitForm(loginForm: NgForm) {
    if (!loginForm.valid) {
      return;
    }
    const email = loginForm.value.email;
    const password = loginForm.value.password;
    this.isLoading = true;
    if (this.isLoginMode) {
      this.authObs = this.authService.loginUser(email, password);
    } else {
      this.authObs = this.authService.signUpUser(email, password);
    }
    this.authObs.subscribe(
      (resBody) => {
        this.isLoading = false;
        this.error = null;
        console.log(resBody);
        this.router.navigate(['recipes']);
      },
      (errorMessage) => {
        this.isLoading = false;
        this.error = errorMessage;
        this.showErrorMessage(errorMessage);
        console.error(errorMessage);
      }
    );
    loginForm.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorMessage(message: string) {
    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      const hostViewContainer = this.alertHost.viewContainerRef;
      hostViewContainer.clear();
      const componentRef = hostViewContainer.createComponent(alertComponentFactory);
      componentRef.instance.message = message;
      this.closeSub = componentRef.instance.close.subscribe(() => {
        this.closeSub.unsubscribe();
        hostViewContainer.clear();
      })
  }
}
