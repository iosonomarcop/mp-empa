import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../data/Order';
import { TrackingStatus } from '../../data/TrackingStatus';
import { StatusLabel } from '../../data/StatusLabel';
import { DiscountAmount } from '../../data/DiscountAmount';
import { OrderCounter } from '../OrderCounter';
import { first } from 'rxjs/operators';
import { OrderStatus } from '../../data/OrderStatus';

@Component({
  selector: 'app-order-details',
  templateUrl: 'order-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailsComponent implements OnInit {
  public order: Order;
  public orderDiscounts: DiscountAmount[];
  public total: number;
  public totalDiscount: number;
  public orderCounter = new OrderCounter();
  public showModal = false;
  public orderStatusEnum = OrderStatus;

  constructor(private route: ActivatedRoute, private router: Router,
              private ordersService: OrdersService, private changeDetectorRef: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.ordersService.getUserOrders().pipe(
      first()).subscribe((orders: Order[]) => {
      this.order = orders.find((order) => order.id === orderId);
      this.orderDiscounts = this.orderCounter.getOrderDiscounts(this.order);
      this.total = this.orderCounter.getOrderTotal(this.order);
      this.totalDiscount = this.getTotalDiscount(this.orderDiscounts);
      this.changeDetectorRef.detectChanges();
    });
  }

  public getTrackingLabel(): StatusLabel {
    return TrackingStatus.getLabelFrom(this.order.tracking);
  }

  public getOrderStatusLabel(): StatusLabel {
    return OrderStatus.getLabelFrom(this.order.status);
  }

  public backToListOfOrders() {
    this.router.navigate(['/orders']);
  }

  public cancelOrder() {
    this.showModal = true;
  }

  public canCancelOrder(): boolean {
    return this.order.status !== OrderStatus.CANCELLED && this.isNotDefined(this.order.tracking);
  }

  private getTotalDiscount(discountAmounts: DiscountAmount[]): number {
    let discountTotal = 0;
    if (discountAmounts) {
      discountAmounts.forEach(discount => discountTotal += discount.amount);
    }

    return discountTotal;
  }

  public closedModal(orderDeleted: boolean): void {
    this.showModal = false;
    if (orderDeleted) {
      this.changeDetectorRef.detectChanges();
    }
  }

  public isPaymentPending() {
    return this.order.status !== OrderStatus.PAID;
  }

  private isNotDefined(value): boolean {
    return value === undefined || value == null;
  }
}
