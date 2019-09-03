import { UserOrdersComponent } from './user-orders.component';
import { User } from '../data/User';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../data/Order';
import { OrdersService } from '../services/orders.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('UserOrdersComponent', () => {
  let ordersService: SpyObj<OrdersService>;
  let userOrdersComponent: UserOrdersComponent;

  const user = {id: 1} as User;

  beforeEach(() => {
    ordersService = createSpyObj<OrdersService>('ordersService', ['getUserOrders']);
    userOrdersComponent = new UserOrdersComponent(ordersService);
  });

  describe('onInit', () => {
    it('should subscribe to currently logged user orders', () => {
      const orderList = [{id: 5} as Order];
      const userOrders = new BehaviorSubject<Order[]>(orderList);

      ordersService.getUserOrders.and.returnValue(userOrders);

      userOrdersComponent.ngOnInit();

      userOrdersComponent.orders.subscribe((list: Order[]) => {
        expect(list).toEqual(orderList);
      });
      expect(ordersService.getUserOrders).toHaveBeenCalled();
    });
  });
});
