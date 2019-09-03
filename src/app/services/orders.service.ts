import { Injectable } from '@angular/core';
import { Order } from '../data/Order';
import { first, map } from 'rxjs/operators';
import { UserOrders } from '../data/UserOrders';
import { UserClient } from '../clients/user.client';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { OrderClient } from '../clients/order.client';
import { CancelledOrder } from '../data/CancelledOrder';
import { OrderStatus } from '../data/OrderStatus';

@Injectable()
export class OrdersService {
  public orders = new BehaviorSubject<Order[]>(undefined);

  constructor(private userClient: UserClient, private authenticationService: AuthenticationService, private orderClient: OrderClient) {
  }

  public getUserOrders(): Observable<Order[]> {
    return this.orders.value ? this.orders : this.reloadUserOrders();
  }

  public reloadUserOrders(): Observable<Order[]> {
    const authenticatedUserId = this.authenticationService.authenticatedUser.value.id;
    return this.userClient.getOrders(authenticatedUserId).pipe(
      first(orders => orders !== undefined),
      map<UserOrders, Order[]>((userOrders: UserOrders) => {
        this.orders.next(userOrders.orders);
        return userOrders.orders;
      }));
  }

  public cancelOrder(orderId: number): Observable<CancelledOrder> {
    return this.orderClient.cancelOrder(orderId).pipe(
      first(),
      map<CancelledOrder, CancelledOrder>((deletedOrder: CancelledOrder) => {
        const userOrders = this.orders.value;
        userOrders.forEach((order) => {
          return order.id !== orderId;
        });
        const cancelledOrder = userOrders.find((order) => {
          return order.id === orderId;
        });

        cancelledOrder.status = OrderStatus.CANCELLED;

        this.orders.next(userOrders);
        return deletedOrder;
      }));
  }
}
