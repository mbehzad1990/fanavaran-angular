import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { DeleteModalComponent } from 'src/shared/components/Modals/delete-modal/delete-modal.component';
import { AddEditStockModalComponent } from 'src/shared/components/Modals/_Stock/add-edit-stock-modal/add-edit-stock-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ActionType, DeleteOperationType, NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { Stock } from 'src/shared/Domain/Models/_Stock/stock';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent implements OnInit , OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  currentRow = -1;
  dataSource = new MatTableDataSource<Stock>();
  isHover: boolean = false;

  displayedColumns: string[] = ['index', 'id', 'name', 'address', 'phone','desc', 'menu'];


  isLoading$!: Observable<boolean>;
  rowIndex!: number;
  //#endregion

  //#region Input & OutPut & Other
  //#endregion
  constructor(private _coreService: FacadService,private dialog: MatDialog) {
    this.isLoading$ = this._coreService.stock.isLoading$;
  }
  ngOnInit(): void {
    this.getData();
  }

  delete(stockModel:Stock){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;

    const delete_data: RequestModalDto<number> = new RequestModalDto<number>();
    delete_data.delete_field_name = stockModel.name;
    delete_data.delete_resource = DeleteOperationType.Stock;

    dialogConfig.data = delete_data
    dialogConfig.direction = "rtl";
    const dialogRef = this.dialog.open(DeleteModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result) {
        const sb=this._coreService.stock.deleteStock(stockModel.id).subscribe(result=>{
          if(result?.isSuccess){
            const actionText=this._coreService.errorHandler.getErrorText(result.resultAction);
            this._coreService.notification.showNotiffication(NotificationType.Success,actionText);
          }else{
            const actionText=this._coreService.errorHandler.getErrorText(result!.resultAction);
            this._coreService.notification.showNotiffication(NotificationType.Warning,actionText);
          }
        });
        this.subscriptions.push(sb);
      }
    });
  }
  edit(stockModel:Stock){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const modal_data=new RequestModalDto<Stock>();
    modal_data.action=ActionType.Update;
    modal_data.data=stockModel;

    dialogConfig.data=modal_data;

    const dialogRef = this.dialog.open(AddEditStockModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // this.treeControl.expand(node);
    });
  }

  getData(){
    const sb=this._coreService.stock.stock$.subscribe(data=>{
      this.dataSource.data=data;
    });
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


}
