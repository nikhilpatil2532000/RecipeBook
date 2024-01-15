import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Take method is use to subscribe only one value of user not each and every value
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth) return true;
        return this.router.createUrlTree(['/auth']);
      })
      //  tap(isAuth => {
      //   if(!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      //  })
    );
  }
}
