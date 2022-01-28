import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditCustomerModalComponent } from './Modals/_Customer/add-edit-customer-modal/add-edit-customer-modal.component';
import { MaterialModule } from '../Others/material/material.module';
import { ResultMessageComponent } from './global/result-message/result-message.component';
import { DeleteModalComponent } from './Modals/delete-modal/delete-modal.component';
import { AddEditGoodModalComponent } from './Modals/_Good/add-edit-good-modal/add-edit-good-modal.component';
import { AddEditStockModalComponent } from './Modals/_Stock/add-edit-stock-modal/add-edit-stock-modal.component';
import { AddEditUnitModalComponent } from './Modals/_Unit/add-edit-unit-modal/add-edit-unit-modal.component';



@NgModule({
  declarations: [
    AddEditCustomerModalComponent,
    ResultMessageComponent,
    DeleteModalComponent,
    AddEditGoodModalComponent,
    AddEditStockModalComponent,
    AddEditUnitModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    ResultMessageComponent
  ]
})
export class ComponentsModule { }
