import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockOperationRoutingModule } from './stock-operation-routing.module';
import { StockOperationComponent } from './stock-operation.component';


@NgModule({
  declarations: [
    StockOperationComponent
  ],
  imports: [
    CommonModule,
    StockOperationRoutingModule
  ]
})
export class StockOperationModule { }
