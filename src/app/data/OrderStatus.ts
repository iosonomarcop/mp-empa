import { OrderLabel } from './OrderLabel';

export enum OrderStatus {
  PAID = 'paid',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
}

// tslint:disable-next-line:no-namespace
export namespace OrderStatus {
  export function getLabelFrom(status: OrderStatus): OrderLabel {
    switch (status) {
      case OrderStatus.PAID:
        return new OrderLabel('Paid', 'ok');
      case OrderStatus.PENDING:
        return new OrderLabel('Pending', 'warning');
        case OrderStatus.CANCELLED:
        return new OrderLabel('Cancelled', 'error');
      default:
        return new OrderLabel('-', 'undefined');
    }
  }
}
