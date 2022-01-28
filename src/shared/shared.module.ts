import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from './Others/material/material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ComponentsModule,
  ],
  exports:[
    MaterialModule,
    ComponentsModule
  ]
})
export class SharedModule { }
