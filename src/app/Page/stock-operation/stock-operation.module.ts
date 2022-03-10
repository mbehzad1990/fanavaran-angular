import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockOperationRoutingModule } from './stock-operation-routing.module';
import { StockOperationComponent } from './stock-operation.component';
import { RemittanceMainComponent } from './Components/remittance-main/remittance-main.component';
import { RemittanceDetailsComponent } from './Components/remittance-main/Steps/remittance-details/remittance-details.component';
import { RemittanceHeaderComponent } from './Components/remittance-main/Steps/remittance-header/remittance-header.component';
import { SharedModule } from 'src/shared/shared.module';
import { AddDetailsComponent } from './Components/remittance-main/Steps/remittance-details/add-details/add-details.component';
import { ListOfRemittanceComponent } from './Components/list-of-remittance/list-of-remittance.component';
import { RemittanceDetailsModalComponent } from './Components/list-of-remittance/remittance-details-modal/remittance-details-modal.component';
import { InventoryStockComponent } from './Components/inventory-stock/inventory-stock.component';
import { InventoryTableComponent } from './Components/inventory-stock/inventory-table/inventory-table.component';
import { GoodCardexComponent } from './Components/good-cardex/good-cardex.component';
import { CardexTableComponent } from './Components/good-cardex/cardex-table/cardex-table.component';
import { ReturnRemittanceComponent } from './Components/return-remittance/return-remittance.component';
import { ReturnRemittanceHeaderComponent } from './Components/return-remittance/Steps/return-remittance-header/return-remittance-header.component';
import { RemittanceDetailTableComponent } from './Components/return-remittance/Steps/return-remittance-header/remittance-detail-table/remittance-detail-table.component';
import { ReturnRemittanceDetailsComponent } from './Components/return-remittance/Steps/return-remittance-details/return-remittance-details.component';


@NgModule({
  declarations: [
    StockOperationComponent,
    RemittanceMainComponent,
    RemittanceDetailsComponent,
    RemittanceHeaderComponent,
    AddDetailsComponent,
    ListOfRemittanceComponent,
    RemittanceDetailsModalComponent,
    InventoryStockComponent,
    InventoryTableComponent,
    GoodCardexComponent,
    CardexTableComponent,
    ReturnRemittanceComponent,
    ReturnRemittanceHeaderComponent,
    RemittanceDetailTableComponent,
    ReturnRemittanceDetailsComponent
  ],
  imports: [
    CommonModule,
    StockOperationRoutingModule,
    SharedModule
  ]
})
export class StockOperationModule { }
