import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api_Key: string = environment.fireBaseApiKey;
  private signUpUrl: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+this.api_Key;
  private loginUrl: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+this.api_Key;

  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimeout: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  signUpUser(email: string, password: string) {
    let httpParams: HttpParams = new HttpParams();
    httpParams.append('key', this.api_Key);
    return this.http
      .post<AuthResponseData>(this.signUpUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.errorHandler),
        tap((resBody) => {
          this.handlAuthentication(resBody);
        })
      );
  }

  loginUser(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.loginUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.errorHandler),
        tap((resBody) => {
          this.handlAuthentication(resBody);
        })
      );
  }

  logOutUser() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }
    this.tokenExpirationTimeout = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimeout = setTimeout(() => {
      this.logOutUser();
    }, expirationDuration);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpiryDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    const previousedLoginUser: User = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpiryDate)
    );

    if (previousedLoginUser.token) {
      this.user.next(previousedLoginUser);
      const expirationDuration =
        new Date(userData._tokenExpiryDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handlAuthentication(resBody: AuthResponseData) {
    const expiryDate: Date = new Date(
      new Date().getTime() + +resBody.expiresIn * 1000
    );
    const user = new User(
      resBody.email,
      resBody.localId,
      resBody.idToken,
      expiryDate
    );
    this.user.next(user);
    this.autoLogout(+resBody.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private errorHandler(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = '';
    if (!errorRes.error || !errorRes.error.error)
      return throwError(errorMessage);

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exist!';
        break;
      case 'WEAK_PASSWORD':
        errorMessage = 'Password should be at least 6 characters';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Login credentials are Invalid!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email is not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password is Invalid';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user is disabled';
        break;
      default:
        errorMessage = 'An Unkown Error Occured!';
    }

    return throwError(errorMessage);
  }
}
