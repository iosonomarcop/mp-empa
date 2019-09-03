import { Order } from '../data/Order';
import { DiscountType } from '../data/DiscountType';
import { DiscountAmount } from '../data/DiscountAmount';

/*
  Discount policy:
    - All percent discount calculated after amount discounts
    - Single discount percent is calculated from total order minus previous discounts
 */
export class OrderCounter {
  public getOrderDiscounts(order: Order): DiscountAmount[] {
    let total = this.getOrderTotal(order);
    const discountAmounts = [];

    const fixedDiscounts = order.discounts.filter(discount => discount.type === DiscountType.AMOUNT);
    fixedDiscounts.forEach(fixedDiscount => {
      discountAmounts.push(new DiscountAmount(fixedDiscount.name, fixedDiscount.value));
      total -= fixedDiscount.value;
    });

    const percentDiscounts = order.discounts.filter(discount => discount.type === DiscountType.PERCENT);
    percentDiscounts.forEach(percentDiscount => {
      const amount = (total * percentDiscount.value) / 100;
      discountAmounts.push(new DiscountAmount(percentDiscount.name, amount));
      total -= amount;
    });

    return discountAmounts;
  }

  public getOrderTotal(order: Order): number {
    let total = 0;
    order.items.forEach(item => total += item.amount);

    return total;
  }
}
