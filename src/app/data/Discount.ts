import { DiscountType } from './DiscountType';

export interface Discount {
  name: string;
  type: DiscountType;
  value: number;
}
