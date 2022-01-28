import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from './Others/material/material.module';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './Project_Config/auth.interceptor';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      closeButton: true,
      autoDismiss: true,
      progressBar: true
    })
  ],
  exports: [
    MaterialModule,
    ComponentsModule
  ], providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },]
})
export class SharedModule { }
