import { UserSessionStorage } from './user-storage.service';
import { User } from '../../data/User';

describe('UserStorage', () => {
  const expectedUser = {id: 1, firstName: 'matt', lastName: 'brown', email: 'mbrown@mail.com'} as User;

  let userStorage: UserSessionStorage;

  beforeEach(() => {
    userStorage = new UserSessionStorage();
    sessionStorage.removeItem(UserSessionStorage.USER_INFO);
  });

  describe('get authenticatedUser', () => {
    it('should return undefined when user not authenticated', () => {
      expect(userStorage.authenticatedUser).toBeUndefined();
    });

    it('should return authenticated user info when stored in session storage', () => {
      sessionStorage.setItem(UserSessionStorage.USER_INFO, JSON.stringify(expectedUser));

      expect(userStorage.authenticatedUser).toEqual(expectedUser);
    });
  });

  describe('set authenticatedUser', () => {
    it('should store authenticated user info in session storage', () => {
      userStorage.authenticatedUser = expectedUser;
      expect(sessionStorage.getItem('userInfo')).toEqual(JSON.stringify(expectedUser));
    });
  });

  describe('removeUserAuthentication', () => {
    it('should remove authenticated user info from session storage', () => {
      userStorage.authenticatedUser = expectedUser;

      userStorage.removeUserAuthentication();

      expect(userStorage.authenticatedUser).toBeUndefined();
    });
  });
});
