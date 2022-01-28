import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharedModule } from 'src/shared/shared.module';
import { UserListComponent } from './Components/user-list/user-list.component';
import { UserTableComponent } from './Components/user-list/user-table/user-table.component';
import { AddUserModalComponent } from './Components/add-user-modal/add-user-modal.component';


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserTableComponent,
    AddUserModalComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
