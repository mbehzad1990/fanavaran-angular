import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from './Others/material/material.module';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './Project_Config/auth.interceptor';
import { PersianCurencyDirective } from './Directive/persian-curency.directive';
import { PersianCurencyPipe } from './Pipe/persian-curency.pipe';



@NgModule({
  declarations: [
  
    PersianCurencyDirective,
        PersianCurencyPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      closeButton: true,
      autoDismiss: true,
      progressBar: true
    })
  ],
  exports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    PersianCurencyDirective,
    PersianCurencyPipe
  ], providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },   DecimalPipe]
})
export class SharedModule {

 }
