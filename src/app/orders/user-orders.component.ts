import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Order } from '../data/Order';
import { Observable } from 'rxjs';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: 'user-orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserOrdersComponent implements OnInit {
  public orders: Observable<Order[]>;

  constructor(private ordersService: OrdersService) {
  }

  public ngOnInit(): void {
    this.orders = this.ordersService.getUserOrders();
  }

}
