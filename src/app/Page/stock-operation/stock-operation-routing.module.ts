import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { GoodCardexComponent } from './Components/good-cardex/good-cardex.component';
import { InventoryStockComponent } from './Components/inventory-stock/inventory-stock.component';
import { ListOfRemittanceComponent } from './Components/list-of-remittance/list-of-remittance.component';
import { RemittanceMainComponent } from './Components/remittance-main/remittance-main.component';
import { ReturnRemittanceComponent } from './Components/return-remittance/return-remittance.component';
import { StockOperationComponent } from './stock-operation.component';

const routes: Routes = [
  { path: '', component: StockOperationComponent,children:[
    { path: 'remittance-buy', component: RemittanceMainComponent,data:{type:StockOperationType.Buy} },
    { path: 'remittance-sell', component: RemittanceMainComponent,data:{type:StockOperationType.Sell} },
    { path: 'remittance-resell', component: ReturnRemittanceComponent,data:{type:StockOperationType.ReSell} },
    { path: 'remittance-rebuy', component: ReturnRemittanceComponent,data:{type:StockOperationType.ReBuy} },
    { path: 'remittance-damage', component: RemittanceMainComponent,data:{type:StockOperationType.Damage} },
    { path: 'remittance-list', component: ListOfRemittanceComponent },
    { path: 'inventory', component: InventoryStockComponent },
    { path: 'good-cardex', component: GoodCardexComponent },
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockOperationRoutingModule { }
