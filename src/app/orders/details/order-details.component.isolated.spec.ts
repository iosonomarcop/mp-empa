import { OrderDetailsComponent } from './order-details.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { ChangeDetectorRef } from '@angular/core';
import { Order } from '../../data/Order';
import { of as observableOf } from 'rxjs';
import { OrderCounter } from '../OrderCounter';
import { DiscountAmount } from '../../data/DiscountAmount';
import { TrackingStatus } from '../../data/TrackingStatus';
import { Tracking } from '../../data/Tracking';
import { async } from '@angular/core/testing';
import { StatusLabel } from '../../data/StatusLabel';
import { OrderStatus } from '../../data/OrderStatus';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('OrderDetailsComponent', () => {
  let orderDetailsComponent: OrderDetailsComponent;

  let router: SpyObj<Router>;
  let orderService: SpyObj<OrdersService>;
  let changeDetectorRef: SpyObj<ChangeDetectorRef>;
  let activatedRoute: ActivatedRoute;
  let orderCounter: SpyObj<OrderCounter>;

  let order: Order;

  beforeEach(() => {
    order = {id: 5} as Order;
    const routeParameters = convertToParamMap({orderId: '5'});
    activatedRoute = {snapshot: {paramMap: routeParameters}} as ActivatedRoute;
    router = createSpyObj<Router>('router', ['navigate']);
    orderService = createSpyObj<OrdersService>('orderService', ['getUserOrders']);
    changeDetectorRef = createSpyObj<ChangeDetectorRef>('changeDetectorRef', ['detectChanges']);
    orderCounter = createSpyObj<OrderCounter>('orderCounter', ['getOrderDiscounts', 'getOrderTotal']);

    orderDetailsComponent = new OrderDetailsComponent(activatedRoute, router, orderService, changeDetectorRef);
    orderDetailsComponent.orderCounter = orderCounter;
  });

  describe('ngOnInit', () => {
    it('should retrieve requested order', () => {
      const otherOrder = {id: 7} as Order;

      orderCounter.getOrderDiscounts.and.returnValue([]);
      orderService.getUserOrders.and.returnValue(observableOf([order, otherOrder]));

      orderDetailsComponent.ngOnInit();

      expect(orderDetailsComponent.order).toEqual(order);
    });

    it('should calculate order discounts', () => {
      const discounts = [new DiscountAmount('discount', 40)];
      orderCounter.getOrderDiscounts.and.returnValue(discounts);
      orderService.getUserOrders.and.returnValue(observableOf([order]));

      orderDetailsComponent.ngOnInit();

      expect(orderDetailsComponent.orderDiscounts).toEqual(discounts);
    });

    it('should return order total amount', () => {
      orderService.getUserOrders.and.returnValue(observableOf([order]));
      orderCounter.getOrderTotal.and.returnValue(250);
      orderCounter.getOrderDiscounts.and.returnValue([]);

      orderDetailsComponent.ngOnInit();

      expect(orderDetailsComponent.total).toEqual(250);
    });

    it('should return total discount', async(() => {
      const discounts = [
        new DiscountAmount('discount', 40),
        new DiscountAmount('other discount', 60)
      ];
      orderService.getUserOrders.and.returnValue(observableOf([order]));
      orderCounter.getOrderTotal.and.returnValue(250);
      orderCounter.getOrderDiscounts.and.returnValue(discounts);

      orderDetailsComponent.ngOnInit();

      expect(orderDetailsComponent.totalDiscount).toEqual(100);
    }));
  });

  it('should return tracking status', () => {
    order.tracking = {status: TrackingStatus.TRANSIT} as Tracking;

    orderService.getUserOrders.and.returnValue(observableOf([order]));

    orderDetailsComponent.ngOnInit();

    expect(orderDetailsComponent.getTrackingLabel()).toEqual(new StatusLabel('In Transit', 'info'));
  });

  it('should return to user list of orders', () => {
    orderDetailsComponent.backToListOfOrders();

    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  });

  describe('isPaymentPending', () => {
    it('should return true if status is pending', () => {
      order.status = OrderStatus.PENDING;
      orderDetailsComponent.order = order;

      expect(orderDetailsComponent.isPaymentPending()).toEqual(true);
    });

    it('should return true if status is undefined', () => {
      order.status = undefined;
      orderDetailsComponent.order = order;

      expect(orderDetailsComponent.isPaymentPending()).toEqual(true);
    });

    it('should return false if status is paid', () => {
      order.status = OrderStatus.PAID;
      orderDetailsComponent.order = order;

      expect(orderDetailsComponent.isPaymentPending()).toEqual(false);
    });
  });

  describe('canCancelOrder', () => {
    it('should return true when tracking is undefined', () => {
      order.tracking = undefined;
      orderDetailsComponent.order = order;

      expect(orderDetailsComponent.canCancelOrder()).toEqual(true);
    });

    it('should return false when order has been delivered', () => {
      order.tracking = {status: TrackingStatus.DELIVERED} as Tracking;
      orderDetailsComponent.order = order;

      expect(orderDetailsComponent.canCancelOrder()).toEqual(false);
    });

    it('should return false when order is in transit', () => {
      order.tracking = {status: TrackingStatus.TRANSIT} as Tracking;
      orderDetailsComponent.order = order;

      expect(orderDetailsComponent.canCancelOrder()).toEqual(false);
    });

    it('should return false when order has been cancelled', () => {
      order.status = OrderStatus.CANCELLED;
      orderDetailsComponent.order = order;

      expect(orderDetailsComponent.canCancelOrder()).toEqual(false);
    });
  });
});
