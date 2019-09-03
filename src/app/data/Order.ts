import { OrderStatus } from './OrderStatus';
import { Item } from './Item';
import { Discount } from './Discount';
import { Tracking } from './Tracking';

export class Order {
  public id: number;
  public ref: string;
  public status: OrderStatus;
  public tracking: Tracking;
  public items: Item[] = [];
  public discounts: Discount[] = [];
}
