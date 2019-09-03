import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CancelledOrder } from '../data/CancelledOrder';

@Injectable()
export class OrderClient {

  constructor(private httpClient: HttpClient) {
  }

  public cancelOrder(orderId: number): Observable<CancelledOrder> {
    return this.httpClient.delete<CancelledOrder>(`/api/orders/${orderId}`);
  }

}
