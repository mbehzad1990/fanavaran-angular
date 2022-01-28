import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { SharedModule } from 'src/shared/shared.module';
import { CustomerListComponent } from './Components/customer-list/customer-list.component';
import { CustomerTableComponent } from './Components/customer-list/customer-table/customer-table.component';


@NgModule({
  declarations: [
    CustomerComponent,
    CustomerTableComponent,
    CustomerListComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
