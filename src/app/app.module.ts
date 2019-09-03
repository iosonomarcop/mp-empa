import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/guards/auth.guard';
import { FormsModule } from '@angular/forms';
import { UserOrdersComponent } from './orders/user-orders.component';
import { UserStorage } from './services/storage/UserStorage';
import { UserSessionStorage } from './services/storage/user-storage.service';
import { AuthenticationService } from './services/authentication.service';
import { UserClient } from './clients/user.client';
import { HttpClientModule } from '@angular/common/http';
import { AvatarComponent } from './avatar/avatar.component';
import { OrderComponent } from './orders/order.component';
import { HeaderComponent } from './header/header.component';
import { OrderDetailsComponent } from './orders/details/order-details.component';
import { OrdersService } from './services/orders.service';
import { DeleteOrderModalComponent } from './orders/details/modal/delete-order-modal.component';
import { OrderClient } from './clients/order.client';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    AvatarComponent,
    UserOrdersComponent,
    OrderComponent,
    OrderDetailsComponent,
    DeleteOrderModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserClient,
    OrderClient,
    OrdersService,
    {provide: UserStorage, useClass: UserSessionStorage}
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
