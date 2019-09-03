import { OrderStatus } from './OrderStatus';
import { OrderLabel } from './OrderLabel';

describe('OrderStatus', () => {
  it('should return label for paid status', () => {
    const label = OrderStatus.getLabelFrom(OrderStatus.PAID);

    const paid = new OrderLabel('Paid', 'ok');

    expect(label).toEqual(paid);
  });

  it('should return label for paid status', () => {
    const label = OrderStatus.getLabelFrom(OrderStatus.PENDING);

    const pending = new OrderLabel('Pending', 'warning');

    expect(label).toEqual(pending);
  });

  it('should return label for cancelled status', () => {
    const label = OrderStatus.getLabelFrom(OrderStatus.CANCELLED);

    const pending = new OrderLabel('Cancelled', 'error');

    expect(label).toEqual(pending);
  });

  it('should return label for undefined status', () => {
    const label = OrderStatus.getLabelFrom(undefined);

    const undefinedStatus = new OrderLabel('-', 'undefined');

    expect(label).toEqual(undefinedStatus);
  });
});
