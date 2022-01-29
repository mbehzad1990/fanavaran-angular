import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockOperationRoutingModule } from './stock-operation-routing.module';
import { StockOperationComponent } from './stock-operation.component';
import { RemittanceMainComponent } from './Components/remittance-main/remittance-main.component';
import { RemittanceDetailsComponent } from './Components/remittance-main/Steps/remittance-details/remittance-details.component';
import { RemittanceHeaderComponent } from './Components/remittance-main/Steps/remittance-header/remittance-header.component';
import { SharedModule } from 'src/shared/shared.module';
import { AddDetailsComponent } from './Components/remittance-main/Steps/remittance-details/add-details/add-details.component';


@NgModule({
  declarations: [
    StockOperationComponent,
    RemittanceMainComponent,
    RemittanceDetailsComponent,
    RemittanceHeaderComponent,
    AddDetailsComponent
  ],
  imports: [
    CommonModule,
    StockOperationRoutingModule,
    SharedModule
  ]
})
export class StockOperationModule { }
