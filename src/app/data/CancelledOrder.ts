import { Item } from './Item';

export interface CancelledOrder {
  orderId: number;
  status: string;
  order: Item;
}
