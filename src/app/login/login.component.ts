import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  public username: string;
  public password: string;

  public verifyingCredentials = new BehaviorSubject<boolean>(false);
  public invalidCredentials = new BehaviorSubject<boolean>(true);

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  public login() {
    this.verifyingCredentials.next(true);
    setTimeout(() => this.loginUser(), 500);
  }

  public loginUser(): void {
    this.authenticationService.loginUser(this.username, this.password).then(
      () => {
        this.router.navigate(['/']);
      }
    ).finally(() => {
      this.verifyingCredentials.next(false);
    });
  }

  public inputChanged(): void {
    const isValid = this.isNotEmpty(this.username) && this.isNotEmpty(this.password);
    this.invalidCredentials.next(!isValid);
  }

  private isNotEmpty(value: string): boolean {
    return value !== undefined && value !== '';
  }
}
