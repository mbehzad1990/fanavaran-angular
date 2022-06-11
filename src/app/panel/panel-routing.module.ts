import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel.component';

const routes: Routes = [
  {path:'',component:PanelComponent,children:[
    {path:'user',loadChildren:()=>import('../Page/user/user.module').then(m=>m.UserModule)},
    {path:'stock',loadChildren:()=>import('../Page/stock/stock.module').then(m=>m.StockModule)},
    {path:'customer',loadChildren:()=>import('../Page/customer/customer.module').then(m=>m.CustomerModule)},
    {path:'unit',loadChildren:()=>import('../Page/unit/unit.module').then(m=>m.UnitModule)},
    {path:'good',loadChildren:()=>import('../Page/good/good.module').then(m=>m.GoodModule)},
    {path:'remittance',loadChildren:()=>import('../Page/stock-operation/stock-operation.module').then(m=>m.StockOperationModule)},
    {path:'report',loadChildren:()=>import('../Page/report/report.module').then(m=>m.ReportModule)},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
