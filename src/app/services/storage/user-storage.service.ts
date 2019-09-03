import { Injectable } from '@angular/core';
import { User } from '../../data/User';
import { UserStorage } from './UserStorage';

@Injectable()
export class UserSessionStorage implements UserStorage {
  public static USER_INFO = 'userInfo';

  public get authenticatedUser(): User {
    const authenticatedUser = sessionStorage.getItem(UserSessionStorage.USER_INFO);

    return authenticatedUser ? JSON.parse(authenticatedUser) : undefined;
  }

  public set authenticatedUser(user: User) {
    sessionStorage.setItem(UserSessionStorage.USER_INFO, JSON.stringify(user));
  }

  public removeUserAuthentication(): void {
    sessionStorage.removeItem(UserSessionStorage.USER_INFO);
  }
}
