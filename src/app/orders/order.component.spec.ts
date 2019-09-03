import { OrderComponent } from './order.component';
import { Router } from '@angular/router';
import { Order } from '../data/Order';
import { OrderCounter } from './OrderCounter';
import { DiscountAmount } from '../data/DiscountAmount';
import { Item } from '../data/Item';
import { OrderStatus } from '../data/OrderStatus';
import { TrackingStatus } from '../data/TrackingStatus';
import { Tracking } from '../data/Tracking';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('OrderComponent', () => {
  let orderComponent: OrderComponent;
  let router: SpyObj<Router>;
  let orderCounter: SpyObj<OrderCounter>;

  beforeEach(() => {
    router = createSpyObj<Router>('router', ['navigate']);
    orderCounter = createSpyObj<OrderCounter>('orderCounter', ['getOrderDiscounts', 'getOrderTotal']);
    orderComponent = new OrderComponent(router);
    orderComponent.orderCounter = orderCounter;
    orderComponent.order = new Order();
  });

  describe('ngOnInit', () => {
    it('should calculate order total amount', () => {
      orderCounter.getOrderTotal.and.returnValue(250);
      orderCounter.getOrderDiscounts.and.returnValue([]);

      orderComponent.ngOnInit();

      expect(orderComponent.orderTotal).toEqual(250);
      expect(orderCounter.getOrderTotal).toHaveBeenCalledWith(orderComponent.order);
    });

    it('should calculate order total amount after discount', () => {
      const discounts = [new DiscountAmount('first', 10), new DiscountAmount('second', 20)];

      orderCounter.getOrderTotal.and.returnValue(200);
      orderCounter.getOrderDiscounts.and.returnValue(discounts);

      orderComponent.ngOnInit();

      expect(orderComponent.orderTotalAfterDiscount).toEqual(170);
      expect(orderCounter.getOrderTotal).toHaveBeenCalledWith(orderComponent.order);
    });
  });

  describe('getFirstItemName', () => {
    it('should return name of first item in list', () => {
      orderComponent.order.items = [{name: 'my item'} as Item, {name: 'other item'} as Item];

      expect(orderComponent.getFirstItemName()).toEqual('my item');
    });
  });

  describe('showOrderDetails', () => {
    it('should redirect to selected item details', () => {
      orderComponent.order.id = 34;

      orderComponent.showOrderDetails();

      expect(router.navigate).toHaveBeenCalledWith(['/order/34']);
    });
  });

  it('should current order payment status', () => {
    orderComponent.order.status = OrderStatus.PAID;

    expect(orderComponent.getPaymentStatusLabel()).toEqual('Paid');
  });

  it('should current order payment status class', () => {
    orderComponent.order.status = OrderStatus.PAID;

    expect(orderComponent.getPaymentStatusClass()).toEqual('ok');
  });

  it('should current tracking status', () => {
    orderComponent.order.tracking = {status: TrackingStatus.DELIVERED} as Tracking;

    expect(orderComponent.getOrderStatusLabel()).toEqual('Delivered');
  });

  it('should current tracking status class', () => {
    orderComponent.order.tracking = {status: TrackingStatus.TRANSIT} as Tracking;

    expect(orderComponent.getOrderStatusClass()).toEqual('info');
  });

  it('should return number of items in the order', () => {
    orderComponent.order.items = [{name: 'first'} as Item, {name: 'other'} as Item];

    expect(orderComponent.getItemsCount()).toEqual(2);
  });
});
