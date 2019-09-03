import { OrderCounter } from './OrderCounter';
import { Order } from '../data/Order';
import { Item } from '../data/Item';
import { Discount } from '../data/Discount';
import { DiscountType } from '../data/DiscountType';
import { DiscountAmount } from '../data/DiscountAmount';

describe('OrderCounter', () => {
  describe('getOrderDiscounts', () => {
    it('should return empty list when no discounts applied', () => {
      const discountAmounts = new OrderCounter().getOrderDiscounts(new Order());

      expect(discountAmounts).toEqual([]);
    });

    it('should return single amount discount', () => {
      const order = new Order();
      order.items = [{amount: 200} as Item, {amount: 100} as Item];
      order.discounts = [{name: 'discountName', value: 50, type: DiscountType.AMOUNT} as Discount];
      const discountAmounts = new OrderCounter().getOrderDiscounts(order);

      expect(discountAmounts).toEqual([new DiscountAmount('discountName', 50)]);
    });

    it('should return single percent discount', () => {
      const order = new Order();
      order.items = [{amount: 200} as Item, {amount: 100} as Item];
      order.discounts = [{name: 'discountName', value: 10, type: DiscountType.PERCENT} as Discount];
      const discountAmounts = new OrderCounter().getOrderDiscounts(order);

      expect(discountAmounts).toEqual([new DiscountAmount('discountName', 30)]);
    });

    it('should calculate discounts based on previous', () => {
      const order = new Order();
      order.items = [{amount: 300} as Item, {amount: 200} as Item];
      order.discounts = [
        {name: 'fistDiscount', value: 10, type: DiscountType.PERCENT} as Discount,
        {name: 'secondDiscount', value: 50, type: DiscountType.AMOUNT} as Discount,
        {name: 'thirdDiscount', value: 20, type: DiscountType.PERCENT} as Discount
      ];
      const discountAmounts = new OrderCounter().getOrderDiscounts(order);

      expect(discountAmounts).toEqual([
        new DiscountAmount('secondDiscount', 50),
        new DiscountAmount('fistDiscount', 45),
        new DiscountAmount('thirdDiscount', 81)
      ]);
    });
  });
});
