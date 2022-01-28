import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodRoutingModule } from './good-routing.module';
import { GoodComponent } from './good.component';


@NgModule({
  declarations: [
    GoodComponent
  ],
  imports: [
    CommonModule,
    GoodRoutingModule
  ]
})
export class GoodModule { }
