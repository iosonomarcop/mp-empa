import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Order } from '../data/Order';
import { TrackingStatus } from '../data/TrackingStatus';
import { OrderStatus } from '../data/OrderStatus';
import { Router } from '@angular/router';
import { OrderCounter } from './OrderCounter';

@Component({
  selector: 'app-order',
  templateUrl: 'order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnInit {
  @Input()
  public order: Order;
  public orderTotal: number;
  public orderTotalAfterDiscount: number;
  public orderCounter = new OrderCounter();
  public orderStatusEnum = OrderStatus;

  constructor(private router: Router) {
  }

  public ngOnInit(): void {
    this.orderTotal = this.orderCounter.getOrderTotal(this.order);
    const totalDiscount = this.getTotalDiscount(this.order);
    this.orderTotalAfterDiscount = this.orderTotal - totalDiscount;
  }

  public getFirstItemName(): string {
    if (this.order.items.length > 0) {
      return this.order.items[0].name;
    }
  }

  public getItemsCount(): number {
    return this.order.items.length;
  }

  public getOrderStatusLabel(): string {
    return TrackingStatus.getLabelFrom(this.order.tracking).label;
  }

  public getOrderStatusClass(): string {
    return TrackingStatus.getLabelFrom(this.order.tracking).className;
  }

  public getPaymentStatusLabel(): string {
    return OrderStatus.getLabelFrom(this.order.status).label;
  }

  public getPaymentStatusClass(): string {
    return OrderStatus.getLabelFrom(this.order.status).className;
  }

  public showOrderDetails(): void {
    this.router.navigate(['/order/' + this.order.id]);
  }

  private getTotalDiscount(order: Order): number {
    const orderDiscounts = this.orderCounter.getOrderDiscounts(order);
    let totalDiscount = 0;
    orderDiscounts.forEach(discount => totalDiscount += discount.amount);

    return totalDiscount;
  }
}
