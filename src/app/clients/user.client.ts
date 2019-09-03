import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../data/User';
import { Injectable } from '@angular/core';
import { LoginData } from '../data/LoginData';
import { UserOrders } from '../data/UserOrders';

@Injectable()
export class UserClient {
  private static LOGIN_ENDPOINT = '/api/login';
  private static USER_INFO_ENDPOINT = '/api/users';

  constructor(private httpClient: HttpClient) {
  }

  public login(username: string, password: string): Observable<LoginData> {
    return this.httpClient.post<LoginData>(UserClient.LOGIN_ENDPOINT, {username, password});
  }

  public getUserInfo(userId: number): Observable<User> {
    const url = UserClient.USER_INFO_ENDPOINT + '/' + userId;
    return this.httpClient.get<User>(url);
  }

  public getOrders(userId: number): Observable<UserOrders> {
    return this.httpClient.get<UserOrders>(`/api/users/${userId}/orders`);
  }

}
