import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserOrdersComponent } from './user-orders.component';
import { BehaviorSubject } from 'rxjs';
import { User } from '../data/User';
import { Order } from '../data/Order';
import { OrderComponent } from './order.component';
import { By } from '@angular/platform-browser';
import { OrdersService } from '../services/orders.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('UserOrders shallow', () => {
  let ordersService: SpyObj<OrdersService>;

  const user = {id: 2, firstName: 'matt', lastName: 'ross'} as User;
  const orderList = [new Order(), new Order()];
  const userOrders = new BehaviorSubject<Order[]>(orderList);

  beforeEach(async(() => {
    ordersService = createSpyObj<OrdersService>('ordersService', ['getUserOrders']);
    ordersService.getUserOrders.and.returnValue(userOrders);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        UserOrdersComponent,
        OrderComponent
      ],
      providers: [
        {
          provide: OrdersService,
          useValue: ordersService
        }
      ]
    }).compileComponents();
  }));

  it('should show all user orders', () => {
    const fixture = TestBed.createComponent(UserOrdersComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.e-orders-content__list-item')).length).toEqual(orderList.length);
  });
});
