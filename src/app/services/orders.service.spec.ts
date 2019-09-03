import { UserClient } from '../clients/user.client';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../data/User';
import { BehaviorSubject, of as observableOf, throwError } from 'rxjs';
import { Order } from '../data/Order';
import { UserOrders } from '../data/UserOrders';
import { OrdersService } from './orders.service';
import { OrderClient } from '../clients/order.client';
import { CancelledOrder } from '../data/CancelledOrder';
import { OrderStatus } from '../data/OrderStatus';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('OrdersService', () => {
  let userClient: SpyObj<UserClient>;
  let orderClient: SpyObj<OrderClient>;
  let authenticationService: AuthenticationService;
  let ordersService: OrdersService;

  const user = {id: 1} as User;

  beforeEach(() => {
    userClient = createSpyObj<UserClient>('userClient', ['getOrders']);
    orderClient = createSpyObj<OrderClient>('orderClient', ['cancelOrder']);
    authenticationService = {authenticatedUser: new BehaviorSubject<User>(user)} as AuthenticationService;
    ordersService = new OrdersService(userClient, authenticationService, orderClient);
  });

  describe('getUserOrders', () => {
    it('should retrieve currently logged user orders from server', () => {
      const orderList = [{id: 5} as Order];
      const userOrders = new BehaviorSubject<UserOrders>({orders: orderList} as UserOrders);

      userClient.getOrders.and.returnValue(userOrders);

      const userOrdersObs = ordersService.getUserOrders();

      userOrdersObs.subscribe((list: Order[]) => {
        expect(list).toEqual(orderList);
      });
      expect(userClient.getOrders).toHaveBeenCalledWith(user.id);
    });

    it('should not retrieve orders form server when already stored', () => {
      const userOrders = new BehaviorSubject<UserOrders>({orders: []} as UserOrders);

      userClient.getOrders.and.returnValue(userOrders);

      ordersService.getUserOrders().subscribe(() => {
        ordersService.getUserOrders().subscribe(() => {
          expect(userClient.getOrders).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('reloadUserOrders', () => {
    it('should always retrieve orders form server', () => {
      const userOrders = new BehaviorSubject<UserOrders>({orders: []} as UserOrders);

      userClient.getOrders.and.returnValue(userOrders);

      ordersService.reloadUserOrders().subscribe(() => {
        ordersService.reloadUserOrders().subscribe((orders: Order[]) => {
          expect(userClient.getOrders).toHaveBeenCalledTimes(2);
          expect(userClient.getOrders).toHaveBeenCalledWith(user.id);
          expect(orders).toEqual([]);
        });
      });
    });
  });

  describe('cancelOrder', () => {
    let cancelledOrder: CancelledOrder;
    let userOrders: Order[];

    beforeEach(() => {
      cancelledOrder = {orderId: 2, status: OrderStatus.CANCELLED} as CancelledOrder;
      userOrders = [{id: 1, status: OrderStatus.PAID} as Order, {id: 2, status: OrderStatus.PENDING} as Order];
      ordersService.orders = new BehaviorSubject<Order[]>(userOrders);
    });

    it('should cancel order', () => {
      orderClient.cancelOrder.and.returnValue(observableOf(cancelledOrder));

      ordersService.cancelOrder(2);

      expect(orderClient.cancelOrder).toHaveBeenCalledWith(2);
    });

    it('should update order status if cancel succeeds', (done) => {
      const expected = [
        {id: 1, status: OrderStatus.PAID} as Order,
        {id: 2, status: OrderStatus.CANCELLED} as Order
      ];

      orderClient.cancelOrder.and.returnValue(observableOf(cancelledOrder));

      ordersService.cancelOrder(2).subscribe(
        () => {
          expect(ordersService.orders.value).toEqual(expected);
          done();
        }
      );
    });

    it('should not update order status if cancel fails', (done) => {
      const expected = userOrders.slice(0);

      orderClient.cancelOrder.and.returnValue(throwError('error'));

      ordersService.cancelOrder(2).subscribe(
        () => {
          Promise.reject(new Error('should fail if cancel fails'));
        },
        () => {
          expect(ordersService.orders.value).toEqual(expected);
          done();
        }
      );
    });
  });
})
;
