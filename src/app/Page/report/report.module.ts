import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { ItemRemainBatchComponent } from './componenets/item-remain-batch/item-remain-batch.component';
import { RemainbatchTableComponent } from './componenets/item-remain-batch/remainbatch-table/remainbatch-table.component';
import { SharedModule } from 'src/shared/shared.module';
import { ItemSaleBatchComponent } from './componenets/item-sale-batch/item-sale-batch.component';
import { ItemSaleBatchTableComponent } from './componenets/item-sale-batch/item-sale-batch-table/item-sale-batch-table.component';


@NgModule({
  declarations: [
    ReportComponent,
    ItemRemainBatchComponent,
    RemainbatchTableComponent,
    ItemSaleBatchComponent,
    ItemSaleBatchTableComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ]
})
export class ReportModule { }
