import { AvatarComponent } from './avatar.component';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../data/User';
import { BehaviorSubject } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AvatarComponent', () => {
  let avatarComponent: AvatarComponent;
  let authenticationService: SpyObj<AuthenticationService>;

  beforeEach(() => {
    authenticationService = createSpyObj<AuthenticationService>('authenticationService', ['logout']);
    avatarComponent = new AvatarComponent(authenticationService);
  });

  describe('ngOnInit', () => {
    it('should get logged user name', () => {
      authenticationService.authenticatedUser = new BehaviorSubject<User>({firstName: 'Matt', lastName: 'Ross'} as User);

      avatarComponent.ngOnInit();

      expect(avatarComponent.name).toEqual('Matt Ross');
    });

    it('should get logged user name initials', () => {
      authenticationService.authenticatedUser = new BehaviorSubject<User>({firstName: 'Matt', lastName: 'Ross'} as User);

      avatarComponent.ngOnInit();

      expect(avatarComponent.initials).toEqual('MR');
    });
  });

  describe('toggleMenu', () => {
    it('should open menu if closed', () => {
      avatarComponent.isMenuOpen = false;

      avatarComponent.toggleMenu();

      expect(avatarComponent.isMenuOpen).toEqual(true);
    });

    it('should close menu if opened', () => {
      avatarComponent.isMenuOpen = true;

      avatarComponent.toggleMenu();

      expect(avatarComponent.isMenuOpen).toEqual(false);
    });
  });

  it('should logout user', () => {
    avatarComponent.logout();

    expect(authenticationService.logout).toHaveBeenCalled();
  });

});
