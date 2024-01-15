import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User;
  isAuthenticated: boolean = false;
  userSubscription:Subscription

  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.user = user;
      this.isAuthenticated = !!user; 
    });
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onClickSave() {
    this.dataStorage.storeRecipes().subscribe((responseData) => {
      console.log(responseData);
    });
  }
  onClickFetch() {
    this.dataStorage.fetchRecipes().subscribe();
  }
  onClickLogout() {
    this.authService.logOutUser();
  }
}
