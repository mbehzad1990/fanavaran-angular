import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { AddEditStockModalComponent } from 'src/shared/components/Modals/_Stock/add-edit-stock-modal/add-edit-stock-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ActionType } from 'src/shared/Domain/Enums/global-enums';
import { Stock } from 'src/shared/Domain/Models/_Stock/stock';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit,OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion
 
  //#region Public field
  currentRow = -1;
  dataSource = new MatTableDataSource<Stock>();
  isHover:boolean=false;
 
  displayedColumns: string[] = ['index', 'id', 'name', 'address', 'phone','menu'];
 
 
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
 
   crudStock(){
     const dialogConfig = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus = true;
     
     const modal_data=new RequestModalDto<Stock>(); 
     modal_data.action=ActionType.Add;
     dialogConfig.data=modal_data;
 
     const dialogRef = this.dialog.open(AddEditStockModalComponent, dialogConfig);
     dialogRef.afterClosed().subscribe(result => {
       // this.treeControl.expand(node);
     });
   }
 }
 