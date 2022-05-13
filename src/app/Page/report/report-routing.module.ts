import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from 'src/app/panel/_theme/error-page/error-page.component';
import { ItemRemainBatchComponent } from './componenets/item-remain-batch/item-remain-batch.component';
import { ItemSaleBatchComponent } from './componenets/item-sale-batch/item-sale-batch.component';
import { ReportComponent } from './report.component';

const routes: Routes = [
  { path: '', component: ReportComponent,children:[
    { path: 'item-remain-batch', component: ItemRemainBatchComponent },
    { path: 'item-sale-batch', component: ItemSaleBatchComponent },
  ] },
  { path: '**', component: ErrorPageComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
