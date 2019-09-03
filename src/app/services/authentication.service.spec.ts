import { AuthenticationService } from './authentication.service';
import { UserClient } from '../clients/user.client';
import { UserStorage } from './storage/UserStorage';
import { User } from '../data/User';
import { BehaviorSubject, of as observableOf, throwError } from 'rxjs';
import { async } from '@angular/core/testing';
import { LoginData } from '../data/LoginData';
import { Router } from '@angular/router';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userClient: SpyObj<UserClient>;
  let router: SpyObj<Router>;

  let userStorage: SpyObj<UserStorage>;
  const loginData = {id: 1} as LoginData;

  const user = {id: 1, firstName: 'matt'} as User;
  beforeEach(() => {
    userClient = createSpyObj<UserClient>('userClient', ['login', 'getUserInfo']);
    router = createSpyObj<Router>('router', ['navigate']);
    userStorage = createSpyObj<UserStorage>('userStorage', ['removeUserAuthentication']);
    userStorage.authenticatedUser = undefined;
    authenticationService = new AuthenticationService(userClient, userStorage, router);
  });

  describe('loginUser', () => {
    it('should return true when authentication succeeds', async(() => {
      userClient.login.and.returnValue(observableOf(loginData));
      userClient.getUserInfo.and.returnValue(observableOf(user));

      const authenticationPromise = authenticationService.loginUser('rob', 'password');

      authenticationPromise.then(
        (validCredentials: boolean) => {
          expect(validCredentials).toEqual(true);
          expect(userClient.login).toHaveBeenCalledWith('rob', 'password');
          expect(userClient.getUserInfo).toHaveBeenCalledWith(loginData.id);
        }
      );
    }));

    it('should store user info into storage when authentication succeeds', async(() => {
      userClient.login.and.returnValue(observableOf(loginData));
      userClient.getUserInfo.and.returnValue(observableOf(user));

      const authenticationPromise = authenticationService.loginUser('matt', 'password');

      authenticationPromise.then(
        () => expect(userStorage.authenticatedUser).toEqual(user)
      );
    }));

    it('should fail when login fails', (done) => {
      userClient.login.and.returnValue(throwError('error'));

      const authenticationPromise = authenticationService.loginUser('matt', 'password');

      authenticationPromise.then(
        () => Promise.reject(new Error('should fail on login error')),
        () => {
          expect(true).toEqual(true);
          done();
        }
      );
    });

    it('should fail if user info cannot be retrieved', (done) => {
      userClient.login.and.returnValue(observableOf(loginData));
      userClient.getUserInfo.and.returnValue(throwError('error'));

      const authenticationPromise = authenticationService.loginUser('matt', 'password');

      authenticationPromise.then(
        () => Promise.reject(new Error('should fail on login error')),
        () => {
          expect(true).toEqual(true);
          done();
        }
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when user not authenticated', () => {
      expect(authenticationService.isAuthenticated()).toEqual(false);
    });

    it('should return true when user authentication is saved within the storage', () => {
      userStorage.authenticatedUser = {id: 1} as User;

      expect(authenticationService.isAuthenticated()).toEqual(true);
    });

    it('should return true when user authentication is saved within the authentication component', () => {
      authenticationService.authenticatedUser = new BehaviorSubject<User>({id: 2} as User);

      expect(authenticationService.isAuthenticated()).toEqual(true);
    });
  });

  describe('logout', () => {
    it('should remove logged user authentication info from storage', () => {
      authenticationService.logout();

      expect(userStorage.removeUserAuthentication).toHaveBeenCalled();
    });

    it('should redirect to login page', () => {
      authenticationService.logout();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
