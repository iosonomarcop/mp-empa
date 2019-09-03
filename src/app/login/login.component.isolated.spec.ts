import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let authenticationService: SpyObj<AuthenticationService>;
  let router: SpyObj<Router>;

  beforeEach(() => {
    authenticationService = createSpyObj<AuthenticationService>('authenticationService', ['loginUser']);
    router = createSpyObj<Router>('router', ['navigate']);
    loginComponent = new LoginComponent(authenticationService, router);
  });

  describe('inputChanged', () => {
    it('should update input validity to true when both username and password are not empty', () => {
      loginComponent.username = 'tom';
      loginComponent.password = 'password';

      loginComponent.inputChanged();

      expect(loginComponent.invalidCredentials.value).toEqual(false);
    });

    it('should have input validity false when username is empty', () => {
      loginComponent.username = '';
      loginComponent.password = 'password';

      loginComponent.inputChanged();

      expect(loginComponent.invalidCredentials.value).toEqual(true);
    });

    it('should have input validity false when password is empty', () => {
      loginComponent.username = 'tom';
      loginComponent.password = '';

      loginComponent.inputChanged();

      expect(loginComponent.invalidCredentials.value).toEqual(true);
    });
  });

  describe('login', () => {
    it('should redirect to home if login is successful', async(() => {
      loginComponent.username = 'tom';
      loginComponent.password = 'password';
      const resolvedPromise = Promise.resolve<boolean>(true);

      authenticationService.loginUser.and.returnValue(resolvedPromise);
      loginComponent.loginUser();

      resolvedPromise.then(
        () => expect(router.navigate).toHaveBeenCalledWith(['/'])
      );

    }));
  });
});
