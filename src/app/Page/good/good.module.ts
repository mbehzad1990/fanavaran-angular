import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodRoutingModule } from './good-routing.module';
import { GoodComponent } from './good.component';
import { GoodListComponent } from './Components/good-list/good-list.component';
import { GoodTableComponent } from './Components/good-list/good-table/good-table.component';
import { AddGroupGoodComponent } from './Components/add-group-good/add-group-good.component';
import { AddDataComponent } from './Components/add-group-good/add-data/add-data.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
  declarations: [
    GoodComponent,
    GoodListComponent,
    GoodTableComponent,
    AddGroupGoodComponent,
    AddDataComponent
  ],
  imports: [
    CommonModule,
    GoodRoutingModule,
    SharedModule
  ]
})
export class GoodModule { }
