import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AddEditCustomerModalComponent } from 'src/shared/components/Modals/_Customer/add-edit-customer-modal/add-edit-customer-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ActionType } from 'src/shared/Domain/Enums/global-enums';
import { Customer } from 'src/shared/Domain/Models/_Customer/customer';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit,OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion
 
  //#region Public field
  currentRow = -1;
  isHover:boolean=false;
 
 
  isLoading$!: Observable<boolean>;
  rowIndex!: number;
  //#endregion
 
  //#region Input & OutPut & Other
  //#endregion
   constructor(private dialog: MatDialog) { }
   ngOnDestroy(): void {
     this.subscriptions.forEach(sb=>sb.unsubscribe());
   }
 
   ngOnInit(): void {
   }
 
   crudCustomer(){
     const dialogConfig = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus = true;
     
     const modal_data=new RequestModalDto<Customer>(); 
     modal_data.action=ActionType.Add;
     dialogConfig.data=modal_data;
 
     const dialogRef = this.dialog.open(AddEditCustomerModalComponent, dialogConfig);
     dialogRef.afterClosed().subscribe(result => {
     });
   }
 }
 