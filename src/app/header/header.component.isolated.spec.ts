import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('HeaderComponent', () => {
  let headerComponent: HeaderComponent;
  let router: SpyObj<Router>;

  beforeEach(() => {
    router = createSpyObj<Router>('router', ['navigate']);

    headerComponent = new HeaderComponent(router);
  });

  it('should navigate to app home', () => {
    headerComponent.home();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
