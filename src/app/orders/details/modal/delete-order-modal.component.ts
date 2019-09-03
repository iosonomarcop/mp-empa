import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-delete-order-modal',
  templateUrl: 'delete-order-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteOrderModalComponent {
  @Input()
  public isOpen = false;
  @Input()
  public orderId: number;

  @Output()
  public orderDeleted = new EventEmitter<boolean>();

  constructor(private orderService: OrdersService) {
  }

  public cancelOrder(): void {
    this.orderService.cancelOrder(this.orderId)
      .pipe(first())
      .subscribe(
        () => {
          this.closeModal(true);
        }, () => {
          this.closeModal(false);
        });
  }

  public back() {
    this.closeModal(false);
  }

  private closeModal(deleted: boolean): void {
    this.isOpen = false;
    this.orderDeleted.emit(deleted);
  }
}
