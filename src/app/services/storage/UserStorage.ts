import { User } from '../../data/User';

export abstract class UserStorage {
  abstract get authenticatedUser(): User;

  abstract set authenticatedUser(user: User);

  abstract removeUserAuthentication(): void;
}
