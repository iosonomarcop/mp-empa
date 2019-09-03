import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../data/User';
import { UserClient } from '../clients/user.client';
import { UserStorage } from './storage/UserStorage';
import { LoginData } from '../data/LoginData';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

  public authenticatedUser = new BehaviorSubject<User>(undefined);

  constructor(private userClient: UserClient, private userStorage: UserStorage, private router: Router) {
  }

  public loginUser(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userClient.login(username, password).toPromise().then(
        (loginData: LoginData) => {
          this.retrieveLoggedUserInfo(loginData.id, resolve, reject);
        }
      ).catch(e => reject(e));
    });
  }

  public isAuthenticated(): boolean {
    if (this.authenticatedUser.value) {
      return true;
    }

    const storageValue = this.userStorage.authenticatedUser;
    if (storageValue) {
      this.authenticatedUser.next(storageValue);
      return true;
    }
    return false;
  }

  public logout(): void {
    this.userStorage.removeUserAuthentication();
    this.authenticatedUser.next(undefined);
    this.router.navigate(['/login']);
  }

  private retrieveLoggedUserInfo(userId: number, resolve, reject): void {
    this.userClient.getUserInfo(userId).toPromise().then(
      (user: User) => {
        this.userStorage.authenticatedUser = user;
        this.authenticatedUser.next(user);
        resolve(true);
      }
    ).catch(e => reject(e));
  }
}
