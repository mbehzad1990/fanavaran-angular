import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { RemittanceMainComponent } from './Components/remittance-main/remittance-main.component';
import { StockOperationComponent } from './stock-operation.component';

const routes: Routes = [
  { path: '', component: StockOperationComponent,children:[
    { path: 'remittance-buy', component: RemittanceMainComponent,data:{type:StockOperationType.Buy} },
    { path: 'remittance-sell', component: RemittanceMainComponent,data:{type:StockOperationType.Sell} },
    { path: 'remittance-resell', component: RemittanceMainComponent,data:{type:StockOperationType.ReSell} },
    { path: 'remittance-rebuy', component: RemittanceMainComponent,data:{type:StockOperationType.ReBuy} },
    { path: 'remittance-damage', component: RemittanceMainComponent,data:{type:StockOperationType.Damage} },
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockOperationRoutingModule { }
