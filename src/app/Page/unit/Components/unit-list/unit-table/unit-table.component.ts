import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { DeleteModalComponent } from 'src/shared/components/Modals/delete-modal/delete-modal.component';
import { AddEditUnitModalComponent } from 'src/shared/components/Modals/_Unit/add-edit-unit-modal/add-edit-unit-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ActionType, DeleteOperationType, NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-unit-table',
  templateUrl: './unit-table.component.html',
  styleUrls: ['./unit-table.component.scss']
})
export class UnitTableComponent implements OnInit ,OnDestroy {

  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  currentRow = -1;
  dataSource = new MatTableDataSource<Unit>();
  isHover: boolean = false;
  
  displayedColumns: string[] = ['index', 'id', 'name','desc', 'menu'];
  
  
  isLoading$!: Observable<boolean>;
  rowIndex!: number;
  //#endregion
  
  //#region Input & OutPut & Other
  //#endregion
  constructor(private _coreService: FacadService,private dialog: MatDialog) { 
    this.isLoading$ = this._coreService.stock.isLoading$;
  }
  ngOnInit(): void {
    this.getData()
  }
  delete(row:Unit){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;

    const delete_data: RequestModalDto<number> = new RequestModalDto<number>();
    delete_data.delete_field_name = row.name;
    delete_data.delete_resource = DeleteOperationType.Unit;

    dialogConfig.data = delete_data
    dialogConfig.direction = "rtl";
    const dialogRef = this.dialog.open(DeleteModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result) {
        const sb=this._coreService.unit.delete(row.id).subscribe(result=>{
          if(result?.isSuccess){
            const actionText=this._coreService.errorHandler.getErrorText(result.resultAction);
            this._coreService.notification.showNotiffication(NotificationType.Success,actionText);
          }else{
    
          }
        });
        this.subscriptions.push(sb);
      }
    });
  }
  edit(row:Unit){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const modal_data=new RequestModalDto<Unit>();
    modal_data.action=ActionType.Update;
    modal_data.data=row;

    dialogConfig.data=modal_data;

    const dialogRef = this.dialog.open(AddEditUnitModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getData(){
    const sb=this._coreService.unit.items$.subscribe(data=>{
      this.dataSource.data=data;
    });
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
