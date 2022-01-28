import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitRoutingModule } from './unit-routing.module';
import { UnitComponent } from './unit.component';
import { UnitListComponent } from './Components/unit-list/unit-list.component';
import { UnitTableComponent } from './Components/unit-list/unit-table/unit-table.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
  declarations: [
    UnitComponent,
    UnitListComponent,
    UnitTableComponent
  ],
  imports: [
    CommonModule,
    UnitRoutingModule,
    SharedModule
  ]
})
export class UnitModule { }
