import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { SharedModule } from 'src/shared/shared.module';
import { StockListComponent } from './Components/stock-list/stock-list.component';
import { StockTableComponent } from './Components/stock-list/stock-table/stock-table.component';


@NgModule({
  declarations: [
    StockComponent,
    StockListComponent,
    StockTableComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    SharedModule
  ]
})
export class StockModule { }
