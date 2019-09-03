import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: SpyObj<Router>;
  let authenticationService: SpyObj<AuthenticationService>;

  const currentRoute = {} as ActivatedRouteSnapshot;
  const routerState = {url: '/current/route'} as RouterStateSnapshot;

  beforeEach(() => {
    router = createSpyObj<Router>('router', ['navigate']);
    authenticationService = createSpyObj<AuthenticationService>('authenticationService', ['isAuthenticated']);
    authGuard = new AuthGuard(router, authenticationService);
  });

  describe('canActivate', () => {
    it('should return true when user already logged in', () => {
      authenticationService.isAuthenticated.and.returnValue(true);

      expect(authGuard.canActivate(currentRoute, routerState)).toEqual(true);
    });

    it('should return false when no user is authenticated', () => {
      authenticationService.isAuthenticated.and.returnValue(false);

      expect(authGuard.canActivate(currentRoute, routerState)).toEqual(false);
    });

    it('should redirect to login page when user is not authenticated', () => {
      authenticationService.isAuthenticated.and.returnValue(false);

      authGuard.canActivate(currentRoute, routerState);

      expect(router.navigate).toHaveBeenCalledWith(['/login'], {queryParams: {returnUrl: routerState.url}});
    });
  });
});
