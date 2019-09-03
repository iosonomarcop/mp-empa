import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../data/User';

@Component({
  selector: 'app-avatar',
  templateUrl: 'avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent implements OnInit {
  public initials: string;
  public name: string;
  public isMenuOpen = false;

  constructor(private authenticationService: AuthenticationService) {
  }

  public ngOnInit(): void {
    const user = this.authenticationService.authenticatedUser.value;
    if (user !== undefined) {
      this.name = this.getName(user);
      this.initials = this.getInitials(user);
    }
  }

  public logout(): void {
    this.authenticationService.logout();
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private getInitials(user: User) {
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  }

  private getName(user: User) {
    return user.firstName + ' ' + user.lastName;
  }
}
