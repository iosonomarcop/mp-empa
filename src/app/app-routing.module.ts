import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './login/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { UserOrdersComponent } from './orders/user-orders.component';
import { HeaderComponent } from './header/header.component';
import { OrderDetailsComponent } from './orders/details/order-details.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: UserOrdersComponent
      },
      {
        path: '',
        component: HeaderComponent,
        outlet: 'header'
      },
      {
        path: 'order',
        children: [
          {
            path: ':orderId',
            component: OrderDetailsComponent
          }
        ]
      }
    ]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
