import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockOperationRoutingModule } from './stock-operation-routing.module';
import { StockOperationComponent } from './stock-operation.component';
import { RemittanceMainComponent } from './Components/remittance-main/remittance-main.component';
import { RemittanceDetailsComponent } from './Components/remittance-main/Steps/remittance-details/remittance-details.component';
import { RemittanceHeaderComponent } from './Components/remittance-main/Steps/remittance-header/remittance-header.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
  declarations: [
    StockOperationComponent,
    RemittanceMainComponent,
    RemittanceDetailsComponent,
    RemittanceHeaderComponent
  ],
  imports: [
    CommonModule,
    StockOperationRoutingModule,
    SharedModule
  ]
})
export class StockOperationModule { }
