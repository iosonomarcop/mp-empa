import { DeleteOrderModalComponent } from './delete-order-modal.component';
import { OrdersService } from '../../../services/orders.service';
import { CancelledOrder } from '../../../data/CancelledOrder';
import { of as observableOf } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('DeleteOrderModalComponent', () => {
  let deleteOrderModalComponent: DeleteOrderModalComponent;
  let ordersService: SpyObj<OrdersService>;

  beforeEach(() => {
    ordersService = createSpyObj<OrdersService>('ordersService', ['cancelOrder']);
    deleteOrderModalComponent = new DeleteOrderModalComponent(ordersService);
  });

  describe('cancelOrder', () => {
    it('should delete the order matching the order id', () => {
      deleteOrderModalComponent.orderId = 4;

      ordersService.cancelOrder.and.returnValue(observableOf({orderId: 4} as CancelledOrder));

      deleteOrderModalComponent.cancelOrder();

      expect(ordersService.cancelOrder).toHaveBeenCalledWith(4);
    });

    it('should close modal', () => {
      ordersService.cancelOrder.and.returnValue(observableOf({} as CancelledOrder));

      deleteOrderModalComponent.cancelOrder();

      expect(deleteOrderModalComponent.isOpen).toEqual(false);
    });

    it('should emit cancelled event', (done) => {
      ordersService.cancelOrder.and.returnValue(observableOf({} as CancelledOrder));

      deleteOrderModalComponent.orderDeleted.subscribe(deleted => {
        expect(deleted).toEqual(true);
        done();
      });

      deleteOrderModalComponent.cancelOrder();
    });
  });

  describe('back', () => {

    it('should not delete order', () => {
      deleteOrderModalComponent.back();

      expect(ordersService.cancelOrder).not.toHaveBeenCalled();
    });

    it('should close modal', () => {
      deleteOrderModalComponent.back();

      expect(deleteOrderModalComponent.isOpen).toEqual(false);
    });

    it('should emit not cancelled event', (done) => {

      deleteOrderModalComponent.orderDeleted.subscribe(deleted => {
        expect(deleted).toEqual(false);
        done();
      });

      deleteOrderModalComponent.back();
    });
  });
});
